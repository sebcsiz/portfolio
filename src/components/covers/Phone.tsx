// pins on the phone's map, in the order the tour visits them
const pins = [
  [136, 150],
  [152, 106],
  [182, 122],
  [176, 70],
];

// Wine tour app: the route draws itself between wineries, then the booking card slides up. (CSS-animated)
export default function Phone() {
  return (
    <g>
      <rect x="110" y="12" width="100" height="176" rx="16" strokeWidth="2" className="fill-panel stroke-ink/30" />
      <rect x="117" y="24" width="86" height="156" rx="9" className="fill-[#141612]" />
      <rect x="148" y="16" width="24" height="4" rx="2" className="fill-ink/25" />

      <path d="M117 92 C140 88 170 100 203 90 M126 180 C130 140 160 130 158 24 M117 140 C150 136 176 150 203 146" fill="none" strokeWidth="5" className="stroke-ink/[0.06]" />

      <path
        d="M136 150 C140 128 146 114 152 106 S174 112 182 122 S188 86 176 70"
        pathLength={1}
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="1"
        className="ph-route stroke-accent"
      />
      {pins.map(([x, y], i) => (
        <g key={i} className="ph-pin" style={{ animationDelay: `${i * 0.75}s` }}>
          <circle cx={x} cy={y} r="6" className="fill-accent/20 stroke-accent" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="2" className="fill-accent" />
        </g>
      ))}

      <g className="ph-sheet">
        <rect x="121" y="144" width="78" height="30" rx="7" className="fill-panel stroke-accent" strokeWidth="1.2" />
        <text x="130" y="157" className="fill-ink font-mono text-[7.5px]">
          Tour booked ✓
        </text>
        <text x="130" y="168" className="fill-muted font-mono text-[6.5px]">
          4 wineries · Sat
        </text>
      </g>

      <text x="60" y="96" textAnchor="middle" className="fill-muted font-mono text-[8px]">
        browse
      </text>
      <text x="60" y="108" textAnchor="middle" className="fill-muted font-mono text-[8px]">
        → book
      </text>
      <text x="262" y="102" textAnchor="middle" className="fill-muted font-mono text-[8px]">
        Android · HCI
      </text>
    </g>
  );
}
