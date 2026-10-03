import { useState } from "react";
import { seeded, useTicker } from "./useLive";

type Msg = { id: number; me: boolean; lines: number[] };

const makeMsg = (id: number, rand: () => number): Msg => ({
  id,
  me: rand() < 0.45,
  lines: Array.from({ length: rand() < 0.35 ? 2 : 1 }, () => 28 + rand() * 62),
});

const rand = seeded(9);
const first = [0, 1, 2, 3].map((id) => makeMsg(id, rand));
const LINE = 9;

const height = (m: Msg) => 10 + m.lines.length * LINE;

// Chatroom app: someone types, the message lands, the conversation scrolls up.
export default function Chat({ live }: { live: boolean }) {
  const [msgs, setMsgs] = useState(first);
  const [pending, setPending] = useState<Msg | null>(null);

  useTicker(live, 900, () => {
    if (!pending) return setPending(makeMsg(msgs[msgs.length - 1].id + 1, Math.random));
    setMsgs([...msgs.slice(-3), pending]);
    setPending(null);
  });

  // stack bubbles upward from the bottom of the window, leaving room for the typing indicator
  const placed: { m: Msg; y: number }[] = [];
  let bottom = pending ? 150 : 172;
  for (const m of [...msgs].reverse()) {
    bottom -= height(m) + 6;
    placed.push({ m, y: bottom + 6 });
  }

  return (
    <g>
      <rect x="60" y="14" width="200" height="172" rx="12" strokeWidth="1.5" className="fill-panel stroke-ink/20" />
      <path d="M60 38H260" className="stroke-ink/15" />
      <circle cx="74" cy="26" r="3" className="fill-accent" />
      <text x="82" y="29" className="fill-ink font-mono text-[8px]">
        # general
      </text>
      <text x="250" y="29" textAnchor="end" className="fill-muted font-mono text-[7px]">
        ws:// · 3 online
      </text>

      <clipPath id="chat-window">
        <rect x="60" y="40" width="200" height="144" />
      </clipPath>
      <g clipPath="url(#chat-window)">
        {placed.map(({ m, y }) => {
          const w = Math.max(...m.lines) + 16;
          const x = m.me ? 250 - w : 70;
          return (
            <g key={m.id} className="transition-transform duration-300" style={{ transform: `translate(${x}px, ${y}px)` }}>
              <rect
                width={w}
                height={height(m)}
                rx="7"
                strokeWidth="1"
                className={m.me ? "fill-accent/15 stroke-accent/70" : "fill-[#1d1e1a] stroke-ink/15"}
              />
              {m.lines.map((lw, i) => (
                <rect key={i} x="8" y={7 + i * LINE} width={lw} height="4" rx="2" className={m.me ? "fill-accent/70" : "fill-ink/40"} />
              ))}
            </g>
          );
        })}
        {pending && (
          <g style={{ transform: `translate(${pending.me ? 214 : 70}px, 154px)` }}>
            <rect width="36" height="18" rx="9" className={pending.me ? "fill-accent/15" : "fill-[#1d1e1a]"} />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={11 + i * 7} cy="9" r="2" className="typing fill-muted" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </g>
        )}
      </g>
    </g>
  );
}
