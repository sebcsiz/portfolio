import { useState, type ReactNode } from "react";
import { useTicker } from "./useLive";

// the validation workflow, snaking across two rows
const Y1 = 52;
const Y2 = 138;
const stages = [
  { label: "Laser scan CSV", x: 56, y: Y1 },
  { label: "Prep + extract", x: 160, y: Y1 },
  { label: "Coarse alignment", x: 264, y: Y1 },
  { label: "MFL-A + MFL-C", x: 264, y: Y2 },
  { label: "Data Fusion · K8s", x: 160, y: Y2 },
  { label: "Validation", x: 56, y: Y2 },
];
const links = [
  [98, Y1, 118, Y1],
  [202, Y1, 222, Y1],
  [264, Y1 + 28, 264, Y2 - 28],
  [222, Y2, 202, Y2],
  [118, Y2, 98, Y2],
];
const DUR = [4, 18, 10, 6, 12, 8]; // ticks each stage stays active
const MOVE = 4; // ticks for the hand-off between stages
const starts = DUR.map((_, i) => DUR.slice(0, i).reduce((sum, d) => sum + d + MOVE, 0));
const END = starts[5] + DUR[5];
const CYCLE = END + 22;

type State = "idle" | "active" | "done";

// ROSEN validation app: data moves through the workflow the app orchestrates, with the LLM agent
// cycling through tool calls during prep and the two weld numberings sliding into coarse alignment.
export default function Validation({ live }: { live: boolean }) {
  const [t, setT] = useState(END); // the still frame shows the finished run

  useTicker(live, 110, () => setT((t + 1) % CYCLE));

  const state = (i: number): State => (t >= starts[i] + DUR[i] ? "done" : t >= starts[i] ? "active" : "idle");
  const progress = (i: number) => Math.min(1, Math.max(0, (t - starts[i]) / DUR[i]));
  const ink = (i: number) => (state(i) === "idle" ? "stroke-ink/25" : "stroke-accent");

  const hop = links.findIndex((_, i) => t >= starts[i] + DUR[i] && t < starts[i + 1]);
  const pulse = (() => {
    if (hop < 0) return null;
    const [x1, y1, x2, y2] = links[hop];
    const f = Math.min(1, (t - starts[hop] - DUR[hop] + 1) / MOVE);
    return { x: x1 + (x2 - x1) * f, y: y1 + (y2 - y1) * f };
  })();

  const box = (i: number, art: ReactNode) => {
    const { x, y, label } = stages[i];
    const st = state(i);
    return (
      <g key={`stage-${i}`}>
        <rect
          x={x - 42}
          y={y - 28}
          width="84"
          height="56"
          rx="8"
          strokeWidth="1.2"
          className={`fill-panel transition-colors duration-300 ${st === "idle" ? "stroke-ink/15" : "stroke-accent"}`}
        />
        {art}
        <text x={x} y={y + 21} textAnchor="middle" className={`font-mono text-[7px] ${st === "idle" ? "fill-muted" : "fill-ink"}`}>
          {label}
        </text>
        {st === "done" && (
          <path d={`M${x + 26} ${y - 20}l3 3 5-6`} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent" />
        )}
      </g>
    );
  };

  const [sx, sy] = [stages[1].x, stages[1].y];
  const tools = [
    [sx - 26, sy - 12],
    [sx, sy - 20],
    [sx + 26, sy - 12],
  ];
  const calling = state(1) === "active" ? Math.floor(progress(1) * 6) % 3 : -1; // the agent's current tool call

  const [ax, ay] = [stages[2].x, stages[2].y];
  const shift = state(2) === "done" ? 0 : state(2) === "active" ? 6 * (1 - progress(2)) : 6;

  const [fx, fy] = [stages[4].x, stages[4].y];
  const [vx, vy] = [stages[5].x, stages[5].y];
  const dip = (x: number, y: number) => `M${x - 28} ${y} h14 c4 0 6 8 10 8 s6 -8 10 -8 h20`;

  return (
    <g>
      {links.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.2" className={state(i + 1) === "idle" && hop !== i ? "stroke-ink/15" : "stroke-accent/60"} />
      ))}

      {box(
        0,
        <g fill="none" strokeWidth="1" className={ink(0)}>
          <rect x={56 - 16} y={Y1 - 19} width="32" height="22" rx="2" />
          <path d={`M40 ${Y1 - 12}h32M40 ${Y1 - 5}h32M50 ${Y1 - 19}v22M61 ${Y1 - 19}v22`} />
        </g>
      )}

      {box(
        1,
        <g>
          {tools.map(([x, y], k) => (
            <g key={k}>
              <line x1={sx} y1={sy - 3} x2={x} y2={y} strokeWidth="1" className={calling === k ? "stroke-accent" : "stroke-ink/20"} />
              <rect x={x - 3.5} y={y - 3.5} width="7" height="7" rx="1.5" className={calling === k ? "fill-accent" : `fill-panel ${ink(1)}`} />
            </g>
          ))}
          <circle cx={sx} cy={sy - 3} r="7" strokeWidth="1.2" className={`fill-panel ${ink(1)}`} />
          <text x={sx} y={sy - 1.2} textAnchor="middle" className={`font-mono text-[4.6px] ${state(1) === "idle" ? "fill-muted" : "fill-accent"}`}>
            LLM
          </text>
        </g>
      )}

      {box(
        2,
        <g strokeWidth="1.2" strokeLinecap="round">
          <g className={`transition-transform duration-100 ${ink(2)}`} style={{ transform: `translateX(${shift}px)` }}>
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <line key={k} x1={ax - 28 + k * 9} y1={ay - 20} x2={ax - 28 + k * 9} y2={ay - 14} />
            ))}
          </g>
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <line key={k} x1={ax - 28 + k * 9} y1={ay - 6} x2={ax - 28 + k * 9} y2={ay} className={ink(2)} />
          ))}
          {state(2) === "done" &&
            [0, 1, 2, 3, 4, 5].map((k) => (
              <line key={k} x1={ax - 28 + k * 9} y1={ay - 13} x2={ax - 28 + k * 9} y2={ay - 7} strokeDasharray="1 1.5" className="stroke-accent/60" />
            ))}
        </g>
      )}

      {box(
        3,
        <g fill="none" strokeWidth="1" strokeLinejoin="round" className={ink(3)}>
          {[Y2 - 17, Y2 - 5].map((y) => (
            <path key={y} d={`M${264 - 24} ${y}l6-3 6 5 6-6 6 4 6-2 6 3 6-1 6 0`} />
          ))}
          <text x={264 - 30} y={Y2 - 15} textAnchor="middle" stroke="none" className="fill-muted font-mono text-[5px]">
            A
          </text>
          <text x={264 - 30} y={Y2 - 3} textAnchor="middle" stroke="none" className="fill-muted font-mono text-[5px]">
            C
          </text>
        </g>
      )}

      {box(
        4,
        <g fill="none" strokeWidth="1.2" className={ink(4)}>
          <path d={`M${fx - 28} ${fy - 18}L${fx - 6} ${fy - 9}M${fx - 28} ${fy}L${fx - 6} ${fy - 9}H${fx + 12}`} />
          {state(4) === "active" ? (
            <circle cx={fx + 20} cy={fy - 9} r="5" strokeDasharray="20 12" className="spin stroke-accent" />
          ) : (
            <circle cx={fx + 20} cy={fy - 9} r="4" className={state(4) === "done" ? "fill-accent stroke-accent" : "fill-panel"} />
          )}
        </g>
      )}

      {box(
        5,
        <g fill="none" strokeWidth="1.2" strokeLinecap="round">
          <path d={dip(vx, vy - 14)} className={state(5) === "idle" ? "stroke-ink/25" : "stroke-ink/70"} />
          <path
            d={dip(vx, vy - 14)}
            strokeDasharray="3 2"
            className={`transition-transform duration-500 ${ink(5)}`}
            style={{ transform: `translateY(${state(5) === "done" ? 0 : 3}px)` }}
          />
        </g>
      )}

      {pulse && <circle key={`hop-${hop}`} cx={pulse.x} cy={pulse.y} r="3" className="fill-accent transition-all duration-100 ease-linear" />}

      <text x="160" y="187" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        orchestrating existing scripts, .NET and Kubernetes services
      </text>
    </g>
  );
}
