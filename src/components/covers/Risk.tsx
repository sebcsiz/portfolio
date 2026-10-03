import { useEffect, useRef } from "react";

const sources = ["card", "wallet", "bank"];
const outcomes = [
  { label: "approve", color: "#2bd46a", score: [0.02, 0.28] },
  { label: "review", color: "#f5b942", score: [0.4, 0.7] },
  { label: "decline", color: "#ff5d5d", score: [0.8, 0.98] },
];
const SY = [50, 100, 150];
const OY = [58, 100, 142];
const inPath = (i: number) => `M48 ${SY[i]} C100 ${SY[i]} 110 100 142 100`;
const outPath = (j: number) => `M178 100 C212 100 220 ${OY[j]} 252 ${OY[j]}`;

const IN = 900; // ms from source to the risk engine
const HOLD = 260; // scoring pause
const OUT = 800; // engine to outcome

const pickOutcome = () => {
  const r = Math.random();
  return r < 0.7 ? 0 : r < 0.9 ? 1 : 2;
};

// Payment Risk Platform: transactions flow into the risk engine, get scored, and are routed by risk.
export default function Risk({ live }: { live: boolean }) {
  const dots = useRef<(SVGCircleElement | null)[]>([]);
  const ins = useRef<(SVGPathElement | null)[]>([]);
  const outs = useRef<(SVGPathElement | null)[]>([]);
  const pills = useRef<(SVGRectElement | null)[]>([]);
  const score = useRef<SVGTextElement>(null);

  useEffect(() => {
    if (!live) return;
    const start = performance.now();
    const slots = [0, 1, 2].map((k) => ({ src: k, out: pickOutcome(), t0: start + k * 650, scored: false }));
    let raf = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      slots.forEach((s, k) => {
        const dot = dots.current[k];
        if (!dot) return;
        const t = now - s.t0;
        let point = { x: 160, y: 100 };
        let color = "#ecebe4";
        if (t < 0) {
          dot.style.opacity = "0";
          return;
        } else if (t < IN) {
          const path = ins.current[s.src]!;
          point = path.getPointAtLength((t / IN) * path.getTotalLength());
        } else if (t < IN + HOLD) {
          if (!s.scored && score.current) {
            const [lo, hi] = outcomes[s.out].score;
            score.current.textContent = `risk ${(lo + Math.random() * (hi - lo)).toFixed(2)}`;
            s.scored = true;
          }
        } else if (t < IN + HOLD + OUT) {
          const path = outs.current[s.out]!;
          point = path.getPointAtLength(((t - IN - HOLD) / OUT) * path.getTotalLength());
          color = outcomes[s.out].color;
        } else {
          // arrived: flash the outcome and send a new transaction from somewhere
          const pill = pills.current[s.out];
          pill?.classList.remove("flash");
          pill?.getBoundingClientRect();
          pill?.classList.add("flash");
          Object.assign(s, { src: Math.floor(Math.random() * 3), out: pickOutcome(), t0: now + 150 + Math.random() * 700, scored: false });
          dot.style.opacity = "0";
          return;
        }
        dot.setAttribute("cx", String(point.x));
        dot.setAttribute("cy", String(point.y));
        dot.style.fill = color;
        dot.style.opacity = "1";
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live]);

  return (
    <g>
      {SY.map((_, i) => (
        <path
          key={`in${i}`}
          ref={(el) => {
            ins.current[i] = el;
          }} d={inPath(i)} fill="none" className="stroke-ink/10" />
      ))}
      {OY.map((_, j) => (
        <path
          key={`out${j}`}
          ref={(el) => {
            outs.current[j] = el;
          }} d={outPath(j)} fill="none" className="stroke-ink/10" />
      ))}

      {sources.map((s, i) => (
        <g key={s}>
          <rect x="10" y={SY[i] - 9} width="38" height="18" rx="4" className="fill-panel stroke-ink/20" />
          <text x="29" y={SY[i] + 3} textAnchor="middle" className="fill-muted font-mono text-[7.5px]">
            {s}
          </text>
        </g>
      ))}

      <path d="M160 74 L180 83 V100 C180 113 171 122 160 127 C149 122 140 113 140 100 V83 Z" strokeWidth="1.5" className="fill-panel stroke-accent" />
      <path d="M152 100l6 6 11-12" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent" />
      <text ref={score} x="160" y="144" textAnchor="middle" className="fill-ink font-mono text-[8px]">
        risk 0.12
      </text>
      <text x="160" y="64" textAnchor="middle" className="fill-muted font-mono text-[7.5px]">
        fraud model
      </text>

      {outcomes.map((o, j) => (
        <g key={o.label}>
          <rect
            ref={(el) => {
              pills.current[j] = el;
            }}
            x="252"
            y={OY[j] - 9}
            width="58"
            height="18"
            rx="9"
            fill={o.color}
            fillOpacity="0.1"
            stroke={o.color}
            strokeOpacity="0.7"
          />
          <text x="281" y={OY[j] + 3} textAnchor="middle" fill={o.color} className="font-mono text-[7.5px]">
            {o.label}
          </text>
        </g>
      ))}

      {[
        [90, 72],
        [160, 100],
        [226, 70],
      ].map(([cx, cy], k) => (
        <circle key={k} ref={(el) => {
            dots.current[k] = el;
          }} cx={cx} cy={cy} r="4" className="fill-ink" />
      ))}
    </g>
  );
}
