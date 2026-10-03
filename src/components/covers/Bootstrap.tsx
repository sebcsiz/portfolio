import { useState, type CSSProperties } from "react";
import { seeded, useTicker } from "./useLive";

const BINS = 15;
const BX = 40;
const BW = 16;
const BASE = 170;
const DOT = 6.6;
const FULL = 64;

type Dot = { id: number; bin: number; row: number };

// roughly normal draws (sum of uniforms), the shape bootstrap means settle into
const drawBin = (rand: () => number) => {
  const z = (rand() + rand() + rand() + rand() - 2) / 0.577;
  return Math.max(0, Math.min(BINS - 1, Math.round(7 + z * 2.2)));
};

const add = (dots: Dot[], bin: number): Dot[] => [...dots, { id: dots.length, bin, row: dots.filter((d) => d.bin === bin).length }];

const rand = seeded(17);
const full = Array.from({ length: FULL }).reduce<Dot[]>((dots) => add(dots, drawBin(rand)), []);

// Options paper: bootstrap resamples rain into a histogram, then the estimate and its interval appear.
export default function Bootstrap({ live }: { live: boolean }) {
  const [dots, setDots] = useState(full);
  const [hold, setHold] = useState(0);

  useTicker(live, 70, () => {
    if (dots.length < FULL) return setDots(add(dots, drawBin(Math.random)));
    if (hold < 30) return setHold(hold + 1);
    setDots([]);
    setHold(0);
  });

  const done = dots.length >= FULL;
  const meanX = BX + 7 * BW + BW / 2;

  return (
    <g>
      <text x={BX} y="20" className="fill-muted font-mono text-[8px]">
        bootstrap means · B = 10,000
      </text>
      {done && (
        <g className="pop">
          <rect x={meanX - 6} y="34" width="12" height={BASE - 34} className="fill-accent/15" />
          <line x1={meanX} y1="30" x2={meanX} y2={BASE} strokeDasharray="3 3" className="stroke-accent" />
          <text x={meanX + 12} y="40" className="fill-accent font-mono text-[9px]">
            μ̂ = −4.841%
          </text>
          <text x={meanX + 12} y="52" className="fill-muted font-mono text-[7.5px]">
            95% CI [−4.902, −4.780]
          </text>
        </g>
      )}
      {dots.map((d) => {
        const cy = BASE - 4 - d.row * DOT;
        return (
          <circle
            key={d.id}
            cx={BX + d.bin * BW + BW / 2}
            cy={cy}
            r="3"
            className="drop fill-accent"
            style={{ "--fall": `${26 - cy}px` } as CSSProperties}
          />
        );
      })}
      <line x1={BX - 6} y1={BASE} x2={BX + BINS * BW + 6} y2={BASE} className="stroke-ink/30" />
      <text x={BX + BINS * BW} y={BASE + 14} textAnchor="end" className="fill-muted font-mono text-[7.5px]">
        mean signed moneyness (%)
      </text>
    </g>
  );
}
