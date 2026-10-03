import { useState } from "react";
import { seeded, useTicker } from "./useLive";

type Tile = { text: string; alpha: number } | null;
type Round = { number: number; tiles: Tile[] };

// a tracklet's crops: mostly the real number at varying legibility, some noise, some blanks
const makeRound = (rand: () => number, blank = rand() < 0.2): Round => {
  // blank: the number is never visible, so the right answer is -1
  const number = blank ? -1 : 1 + Math.floor(rand() * 99);
  const tiles = Array.from({ length: 25 }, (): Tile => {
    const r = rand();
    if (!blank && r < 0.62) return { text: String(number), alpha: 0.35 + rand() * 0.65 };
    if (r < (blank ? 0.25 : 0.78)) return { text: String(1 + Math.floor(rand() * 99)), alpha: 0.2 + rand() * 0.3 };
    return null;
  });
  return { number, tiles };
};

const first = makeRound(seeded(23), false);
const SIZE = 25;
const GAP = 3;
const GX = 26;
const GY = 22;
const GRID = 5 * SIZE + 4 * GAP;

// Jersey paper: crops land in a 25-tile collage, the vision-language model scans it, out comes one number.
export default function Jersey({ live }: { live: boolean }) {
  const [round, setRound] = useState(first);
  const [t, setT] = useState(60); // ticks into the cycle: tiles 0-25, scan 26-40, read 41+

  useTicker(live, 60, () => {
    if (t >= 72) {
      setRound(makeRound(Math.random));
      setT(0);
    } else setT(t + 1);
  });

  const scanning = t > 26 && t <= 40;
  const read = t > 40;

  return (
    <g>
      {round.tiles.map((tile, i) => {
        const x = GX + (i % 5) * (SIZE + GAP);
        const y = GY + Math.floor(i / 5) * (SIZE + GAP);
        return (
          <g key={i} className="transition-opacity duration-150" style={{ opacity: i < t ? 1 : 0 }}>
            <rect x={x} y={y} width={SIZE} height={SIZE} rx="3" className="fill-[#1b1c18] stroke-ink/10" />
            {tile && (
              <text x={x + SIZE / 2} y={y + SIZE / 2 + 4} textAnchor="middle" className="fill-ink font-mono text-[11px] font-medium" style={{ opacity: tile.alpha }}>
                {tile.text}
              </text>
            )}
          </g>
        );
      })}
      {scanning && <rect x={GX} y={GY - 4} width="2.5" height={GRID + 8} rx="1" className="scan fill-accent" />}
      <text x={GX} y={GY + GRID + 18} className="fill-muted font-mono text-[8px]">
        tracklet collage · ≤25 crops
      </text>

      <path d="M174 92h22m-6-5 6 5-6 5" fill="none" strokeWidth="1.5" className={read || scanning ? "stroke-accent" : "stroke-ink/25"} />
      <rect x="204" y="44" width="96" height="96" rx="12" strokeWidth="1.5" className={`fill-panel ${read ? "stroke-accent" : "stroke-ink/25"}`} />
      <text x="252" y="62" textAnchor="middle" className="fill-muted font-mono text-[8px]">
        Qwen3-VL + LoRA
      </text>
      <text x="252" y="108" textAnchor="middle" className={`font-mono text-[30px] font-medium ${read ? "fill-accent" : "fill-ink/30"}`}>
        {read ? (round.number === -1 ? "−1" : round.number) : scanning ? "…" : ""}
      </text>
      <text x="252" y="128" textAnchor="middle" className="fill-muted font-mono text-[7.5px]">
        {read ? (round.number === -1 ? "no number visible" : "tracklet prediction") : ""}
      </text>
    </g>
  );
}
