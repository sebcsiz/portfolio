import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type MotionStyle } from "framer-motion";
import Frame, { stage } from "../components/Frame";
import Name from "../components/Name";
import Ball, { type Pass, type Team } from "./Ball";
import { spots, type Go, type RoomId } from "../data/rooms";

// pitch markings as [x, y, w, h] in % of a landscape pitch; transposed for portrait
const marks = [
  [0, 20, 16, 60], // penalty areas
  [84, 20, 16, 60],
  [0, 36, 5.5, 28], // goal areas
  [94.5, 36, 5.5, 28],
];

// each team owns a net: put the ball in it and that team's number goes up
const teams = {
  a: { color: "#2bd46a", land: [100, 42, 1.6, 16], port: [42, -1.6, 16, 1.6] }, // right, or top on portrait
  b: { color: "#ff8a5b", land: [-1.6, 42, 1.6, 16], port: [42, 100, 16, 1.6] }, // left, or bottom
} as const;

const centerOf = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

const ringOf = (button: HTMLElement) => button.querySelector<HTMLElement>("[data-ring]")!;

// Soccer skin: a tactics board. Click a player to pass them the ball and open their section.
export default function Pitch({ go, paused }: { go: Go; paused: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [aim, setAim] = useState<HTMLElement | null>(null);
  const [pass, setPass] = useState<Pass>(null);
  const [score, setScore] = useState<Record<Team, number>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("score") ?? "{}");
      return { a: Number(saved.a) || 0, b: Number(saved.b) || 0 };
    } catch {
      return { a: 0, b: 0 };
    }
  });
  const [celebrating, setCelebrating] = useState<Team | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("score", JSON.stringify(score));
    } catch {
      /* storage blocked; the score just won't stick */
    }
  }, [score]);

  const kick = (id: RoomId, button: HTMLElement) => {
    if (pass) return;
    const ring = ringOf(button);
    const open = () => {
      setPass(null);
      setAim(null);
      go(id, centerOf(ring));
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) open();
    else setPass({ el: ring, done: open });
  };

  const scored = (team: Team) => {
    setScore((s) => ({ ...s, [team]: s[team] + 1 }));
    setCelebrating(team);
    setTimeout(() => setCelebrating(null), 1400);
  };

  return (
    <Frame
      paused={paused}
      hint={{ pointer: "Click a player to explore · the ball is kickable", touch: "Tap a player · swipe the ball" }}
      status={
        <span className="flex items-center gap-1.5 tabular-nums">
          <span className="px-1.5 rounded-sm font-medium text-bg" style={{ background: teams.a.color }}>A</span>
          <span className="text-ink">
            {score.a} – {score.b}
          </span>
          <span className="px-1.5 rounded-sm font-medium text-bg" style={{ background: teams.b.color }}>B</span>
        </span>
      }
    >
      <div ref={box} className={`${stage} pitch border border-ink/15`}>
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          stroke="currentColor"
          className="absolute inset-0 w-full h-full overflow-visible text-ink/15 [&_*]:[vector-effect:non-scaling-stroke]"
        >
          {[false, true].map((portrait) => (
            <g key={String(portrait)} className={portrait ? "landscape:hidden" : "portrait:hidden"}>
              {marks.map(([x, y, w, h], i) =>
                portrait ? (
                  <rect key={i} x={y} y={x} width={h} height={w} />
                ) : (
                  <rect key={i} x={x} y={y} width={w} height={h} />
                )
              )}
              {portrait ? <line x1="0" y1="50" x2="100" y2="50" /> : <line x1="50" y1="0" x2="50" y2="100" />}
              {(["a", "b"] as const).map((team) => {
                const [x, y, w, h] = portrait ? teams[team].port : teams[team].land;
                const { color } = teams[team];
                return <rect key={team} x={x} y={y} width={w} height={h} stroke={color} fill={color} fillOpacity={0.15} />;
              })}
            </g>
          ))}
        </svg>
        <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[28vmin] aspect-square rounded-full border border-ink/15" />

        <div className="absolute inset-0 grid place-items-center text-center pointer-events-none">
          <Name
            paused={paused}
            size="text-[length:clamp(3rem,min(11vw,16vh),10.5rem)] portrait:text-[length:min(15vw,9vh)] short:text-[length:13vh]"
          />
        </div>

        <Ball box={box} aim={aim} pass={pass} paused={paused} onGoal={scored} />

        {spots.map((r, i) => (
          <motion.button
            key={r.id}
            data-player={r.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 + i * 0.08, type: "spring", stiffness: 260, damping: 18 }}
            onClick={(e) => kick(r.id, e.currentTarget)}
            onPointerEnter={(e) => e.pointerType === "mouse" && setAim(ringOf(e.currentTarget))}
            onPointerLeave={() => setAim(null)}
            onFocus={(e) => e.currentTarget.matches(":focus-visible") && setAim(ringOf(e.currentTarget))}
            onBlur={() => setAim(null)}
            aria-label={`${r.label}: ${r.soccer.caption}`}
            className="placed group absolute z-10 flex flex-col items-center gap-1.5 md:gap-2 rounded-xl focus-visible:outline-none"
            style={
              {
                x: "-50%",
                y: "-50%",
                "--x": `${r.soccer.land[0]}%`,
                "--y": `${r.soccer.land[1]}%`,
                "--px": `${r.soccer.port[0]}%`,
                "--py": `${r.soccer.port[1]}%`,
                "--i": i,
              } as MotionStyle
            }
          >
            <span
              data-ring
              className="player-ring grid place-items-center w-11 h-11 md:w-14 md:h-14 rounded-full border-2 border-accent bg-bg font-mono text-sm md:text-base text-accent transition duration-300 group-hover:bg-accent group-hover:text-bg group-hover:scale-110 group-focus-visible:bg-accent group-focus-visible:text-bg group-focus-visible:scale-110 group-active:scale-95"
            >
              {r.soccer.no}
            </span>
            <span className="text-base md:text-2xl font-medium tracking-tight leading-none whitespace-nowrap transition-colors group-hover:text-accent">
              {r.label}
            </span>
            <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-muted whitespace-nowrap short:hidden">
              {r.soccer.pos} · {r.soccer.caption}
            </span>
          </motion.button>
        ))}

        <AnimatePresence>
          {celebrating && (
            <motion.div
              key="goal"
              aria-live="polite"
              initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: -4 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 16 }}
              className="absolute inset-0 z-30 grid place-items-center content-center gap-2 pointer-events-none text-center"
              style={{ color: teams[celebrating].color }}
            >
              <p
                className="font-serif italic text-[length:24vmin] leading-none"
                style={{ textShadow: `0 0 80px ${teams[celebrating].color}73` }}
              >
                Goal!
              </p>
              <p className="justify-self-center rounded-full border border-current bg-bg px-4 py-1.5 font-mono text-sm md:text-base uppercase tracking-[0.3em]">
                Team {celebrating.toUpperCase()} · {score.a} – {score.b}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Frame>
  );
}
