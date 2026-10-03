import { useState } from "react";
import { seeded, useTicker } from "./useLive";

const RINGS = 7;
const browsers = ["Chrome 124 · Windows", "Firefox 126 · macOS", "Safari 17 · iOS", "Edge 125 · Windows"];

// each spoof gets a new ridge pattern: dash lengths and rotation per ring
const ridges = (seed: number) => {
  const r = seeded(seed * 7919 + 1);
  return Array.from({ length: RINGS }, () => ({ dash: `${10 + r() * 34} ${3 + r() * 9}`, rot: r() * 360 }));
};

const hash = (n: number) => (Math.imul(n + 7, 2654435761) >>> 0).toString(16).padStart(8, "0").slice(0, 8);

// Browser fingerprint spoofer: the fingerprint reshuffles and the reported identity changes.
export default function Fingerprint({ live }: { live: boolean }) {
  const [seed, setSeed] = useState(1);
  useTicker(live, 1700, () => setSeed(seed + 1));

  return (
    <g>
      <rect x="72" y="12" width="176" height="176" rx="12" strokeWidth="1.5" className="fill-panel stroke-ink/20" />
      <path d="M72 32H248" className="stroke-ink/15" />
      {[84, 93, 102].map((cx) => (
        <circle key={cx} cx={cx} cy="22" r="2.5" className="fill-ink/25" />
      ))}
      <rect x="114" y="17" width="122" height="10" rx="5" className="fill-[#1d1e1a]" />
      <text x="122" y="24.5" className="fill-muted font-mono text-[6.5px]">
        about:blank
      </text>

      {ridges(seed).map((ring, i) => (
        <ellipse
          key={i}
          cx="160"
          cy="94"
          rx={8 + i * 6.4}
          ry={(8 + i * 6.4) * 1.22}
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray={ring.dash}
          className={`transition-[transform,stroke-dasharray] duration-700 ${i % 2 ? "stroke-ink/35" : "stroke-accent"}`}
          style={{ transform: `rotate(${ring.rot}deg)`, transformOrigin: "160px 94px" }}
        />
      ))}

      <text x="84" y="164" className="fill-muted font-mono text-[7px]">
        canvas {hash(seed)}
      </text>
      <text x="236" y="164" textAnchor="end" className="fill-accent font-mono text-[7px]">
        spoofed ✓
      </text>
      <text x="84" y="177" className="fill-ink/60 font-mono text-[7px]">
        {browsers[seed % browsers.length]}
      </text>
    </g>
  );
}
