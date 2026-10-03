import { useState } from "react";
import { seeded, useTicker } from "./useLive";

type Shot = { x: number; y: number; xg: number; goal: boolean };

// a shot somewhere in the attacking third; closer and more central means a higher xG
const makeShot = (rand: () => number): Shot => {
  const d = 14 + Math.pow(rand(), 1.4) * 118;
  const a = (rand() - 0.5) * Math.PI * 0.8;
  const xg = Math.min(0.85, Math.max(0.02, 0.9 * Math.exp(-d / 38) * (1 - Math.abs(a) / 2)));
  return { x: 160 + Math.sin(a) * d * 1.3, y: 20 + Math.cos(a) * d, xg, goal: rand() < xg };
};

const rand = seeded(5);
const first = Array.from({ length: 11 }, () => makeShot(rand));
const MAX = 14;

// Data analytics project: an xG shot map fills in, sized by chance quality, goals filled in.
export default function Shots({ live }: { live: boolean }) {
  const [shots, setShots] = useState(first);
  const [hold, setHold] = useState(0);

  useTicker(live, 420, () => {
    if (shots.length < MAX) return setShots([...shots, makeShot(Math.random)]);
    if (hold < 5) return setHold(hold + 1);
    setShots([]);
    setHold(0);
  });

  const xg = shots.reduce((sum, s) => sum + s.xg, 0);
  const goals = shots.filter((s) => s.goal).length;

  return (
    <g>
      <g fill="none" className="stroke-ink/25">
        <path d="M20 20H300" />
        <rect x="88" y="20" width="144" height="72" />
        <rect x="128" y="20" width="64" height="24" />
        <rect x="144" y="12" width="32" height="8" className="stroke-ink/40" />
        <path d="M128 92 A40 40 0 0 0 192 92" />
        <path d="M20 20V200M300 20V200" />
      </g>
      <circle cx="160" cy="68" r="1.5" className="fill-ink/40" />
      {shots.map((s, i) => (
        <circle
          key={`${i}-${s.x}`}
          cx={s.x}
          cy={s.y}
          r={3 + s.xg * 14}
          strokeWidth="1.5"
          className={`pop ${s.goal ? "fill-accent/80 stroke-accent" : "fill-none stroke-ink/50"}`}
        />
      ))}
      <text x="28" y="176" className="fill-accent font-mono text-[10px]">
        xG {xg.toFixed(2)}
      </text>
      <text x="28" y="188" className="fill-muted font-mono text-[7.5px]">
        {goals} goals · {shots.length} shots
      </text>
    </g>
  );
}
