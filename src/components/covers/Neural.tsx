import { useState } from "react";
import { useTicker } from "./useLive";

const layers = [4, 6, 5, 1];
const X = [62, 130, 198, 262];
const features = ["dist", "angle", "body", "assist"];
const nodes = layers.map((n, l) => Array.from({ length: n }, (_, i) => ({ x: X[l], y: 100 + (i - (n - 1) / 2) * 28 })));
const OUT = layers.length - 1;

const randomPath = () => layers.map((n) => Math.floor(Math.random() * n));

// xG model: a signal enters at a random input and gets traced through the network to the output.
export default function Neural({ live }: { live: boolean }) {
  const [path, setPath] = useState([1, 3, 2, 0]);
  const [step, setStep] = useState(OUT); // how far along the path the pulse has travelled
  const [xg, setXg] = useState(0.31);

  useTicker(live, 230, () => {
    if (step >= OUT + 3) {
      setPath(randomPath());
      setStep(0);
      return;
    }
    if (step + 1 === OUT) setXg(Math.round((0.04 + Math.random() * 0.8) * 100) / 100);
    setStep(step + 1);
  });

  const nodeOn = (l: number, i: number) => step >= l && path[l] === i;
  const edgeOn = (l: number, i: number, j: number) => step > l && path[l] === i && path[l + 1] === j;

  return (
    <g>
      {nodes.slice(0, -1).map((layer, l) =>
        layer.map((a, i) =>
          nodes[l + 1].map((b, j) => (
            <line
              key={`${l}-${i}-${j}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              strokeWidth={edgeOn(l, i, j) ? 2.2 : 1}
              className={`transition-colors duration-200 ${edgeOn(l, i, j) ? "stroke-accent" : "stroke-ink/10"}`}
            />
          ))
        )
      )}
      {nodes.map((layer, l) =>
        layer.map((n, i) => (
          <circle
            key={`n${l}-${i}`}
            cx={n.x}
            cy={n.y}
            r={l === OUT ? 11 : 7}
            strokeWidth="1.5"
            className={`transition-colors duration-200 ${nodeOn(l, i) ? "fill-accent stroke-accent" : "fill-panel stroke-ink/30"}`}
          />
        ))
      )}
      {features.map((f, i) => (
        <text key={f} x={X[0] - 13} y={nodes[0][i].y + 3} textAnchor="end" className="fill-muted font-mono text-[8px]">
          {f}
        </text>
      ))}
      <text x={X[OUT]} y={80} textAnchor="middle" className="fill-muted font-mono text-[8px]">
        xG
      </text>
      <text x={X[OUT]} y={128} textAnchor="middle" className={`font-mono text-[13px] ${step >= OUT ? "fill-accent" : "fill-ink/40"}`}>
        {xg.toFixed(2)}
      </text>
    </g>
  );
}
