import { useState } from "react";
import { seeded, useTicker } from "./useLive";

type Step =
  | { kind: "leaf"; c: number; i: number }
  | { kind: "prune"; c: number; i: number }
  | { kind: "min"; c: number; v: number }
  | { kind: "max"; v: number; best: number };

// alpha-beta over a two-ply tree (MAX root, three MIN children, three leaves each), recorded step by step
const solve = (leaves: number[][]) => {
  const steps: Step[] = [];
  let alpha = -Infinity;
  let best = 0;
  leaves.forEach((kids, c) => {
    let v = Infinity;
    for (let i = 0; i < kids.length; i++) {
      steps.push({ kind: "leaf", c, i });
      v = Math.min(v, kids[i]);
      if (v <= alpha) {
        for (let j = i + 1; j < kids.length; j++) steps.push({ kind: "prune", c, i: j });
        break;
      }
    }
    steps.push({ kind: "min", c, v });
    if (v > alpha) {
      alpha = v;
      best = c;
    }
  });
  steps.push({ kind: "max", v: alpha, best });
  return steps;
};

const makeRound = (rand: () => number) => {
  const leaves = [0, 1, 2].map(() => [0, 1, 2].map(() => Math.floor(rand() * 19) - 9));
  return { leaves, steps: solve(leaves) };
};

const first = makeRound(seeded(11));
const CX = [70, 160, 250];
const LEAF = [-26, 0, 26];
const tri = (x: number, y: number, up: boolean) => (up ? `M${x} ${y - 9}L${x + 10} ${y + 7}H${x - 10}Z` : `M${x} ${y + 9}L${x + 10} ${y - 7}H${x - 10}Z`);

// Game of the Amazons AI: minimax search with alpha-beta pruning, explored and pruned live.
export default function GameTree({ live }: { live: boolean }) {
  const [round, setRound] = useState(first);
  const [step, setStep] = useState(first.steps.length); // the still frame shows the solved tree

  useTicker(live, 380, () => {
    if (step >= round.steps.length + 4) {
      setRound(makeRound(Math.random));
      setStep(0);
    } else setStep(step + 1);
  });

  const done = round.steps.slice(0, step);
  const has = (kind: Step["kind"], c: number, i: number) => done.some((s) => s.kind === kind && "i" in s && s.c === c && s.i === i);
  const minOf = (c: number) => done.find((s): s is Extract<Step, { kind: "min" }> => s.kind === "min" && s.c === c)?.v;
  const max = done.find((s): s is Extract<Step, { kind: "max" }> => s.kind === "max");

  return (
    <g>
      <text x="14" y="33" className="fill-muted font-mono text-[7px]">
        MAX
      </text>
      <text x="14" y="95" className="fill-muted font-mono text-[7px]">
        MIN
      </text>
      <text x="306" y="190" textAnchor="end" className="fill-muted font-mono text-[7px]">
        α–β pruning
      </text>

      {CX.map((cx, c) => (
        <g key={c}>
          <line x1="160" y1="38" x2={cx} y2="84" strokeWidth={max?.best === c ? 2 : 1} className={max?.best === c ? "stroke-accent" : "stroke-ink/25"} />
          {LEAF.map((dx, i) => {
            const pruned = has("prune", c, i);
            const seen = has("leaf", c, i);
            const x = cx + dx;
            return (
              <g key={i}>
                <line
                  x1={cx}
                  y1="100"
                  x2={x}
                  y2="146"
                  strokeDasharray={pruned ? "3 3" : undefined}
                  className={pruned ? "stroke-ink/15" : seen ? "stroke-ink/50" : "stroke-ink/20"}
                />
                {pruned && (
                  <text x={(cx + x) / 2 + (dx < 0 ? -6 : 6)} y="126" textAnchor="middle" className="fill-[#ff5d5d] font-mono text-[9px]">
                    ×
                  </text>
                )}
                <rect
                  x={x - 10}
                  y="146"
                  width="20"
                  height="20"
                  rx="4"
                  className={`transition-colors duration-200 ${pruned ? "fill-panel stroke-ink/10" : seen ? "fill-[#1d1e1a] stroke-ink/50" : "fill-panel stroke-ink/20"}`}
                />
                <text x={x} y="159.5" textAnchor="middle" className={`font-mono text-[8.5px] ${pruned ? "fill-ink/20" : "fill-ink"}`}>
                  {seen ? round.leaves[c][i] : pruned ? "–" : ""}
                </text>
              </g>
            );
          })}
          <path d={tri(cx, 92, false)} strokeWidth="1.5" className={minOf(c) !== undefined ? "fill-panel stroke-accent" : "fill-panel stroke-ink/30"} />
          <text x={cx + 16} y="95" className="fill-accent font-mono text-[9px]">
            {minOf(c) ?? ""}
          </text>
        </g>
      ))}

      <path d={tri(160, 30, true)} strokeWidth="1.5" className={max ? "fill-accent stroke-accent" : "fill-panel stroke-ink/30"} />
      <text x="178" y="34" className="fill-accent font-mono text-[10px]">
        {max ? max.v : ""}
      </text>
    </g>
  );
}
