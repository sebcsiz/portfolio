// the three hub skins, each drawn small; a shared full-size rect keeps their flip centres aligned
const frame = <rect x="58" y="50" width="204" height="128" fill="transparent" />;

const scenes = [
  <g key="pitch">
    {frame}
    <g fill="none" className="stroke-ink/30">
      <rect x="76" y="60" width="168" height="108" />
      <path d="M160 60V168" />
      <circle cx="160" cy="114" r="15" />
      <rect x="76" y="94" width="18" height="40" />
      <rect x="226" y="94" width="18" height="40" />
    </g>
    {[
      [110, 82],
      [124, 140],
      [196, 78],
      [210, 132],
      [86, 114],
    ].map(([cx, cy]) => (
      <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="4" className="fill-accent" />
    ))}
    <circle cx="160" cy="114" r="2.5" className="fill-ink" />
  </g>,
  <g key="mountain">
    {frame}
    <path d="M66 172 L110 122 L128 134 L162 80 L206 138 L254 172 Z" strokeWidth="1.2" className="fill-[#151612] stroke-ink/40" />
    <path d="M150 98 L162 80 L176 100 L169 96 L162 102 L156 96 Z" className="fill-ink/30" />
    <circle cx="226" cy="76" r="10" className="fill-[#e6e3d5]" />
    {[
      [92, 70],
      [130, 62],
      [196, 66],
      [248, 104],
    ].map(([cx, cy]) => (
      <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="1" className="fill-ink/60" />
    ))}
    <rect x="148" y="130" width="16" height="5" rx="2.5" className="fill-accent" transform="rotate(-20 156 132)" />
  </g>,
  <g key="arcade">
    {frame}
    <rect x="98" y="88" width="124" height="58" rx="29" strokeWidth="1.5" className="fill-panel stroke-ink/40" />
    <path d="M122 110h8v-8h8v8h8v8h-8v8h-8v-8h-8z" className="fill-ink/50" />
    <circle cx="188" cy="110" r="5" className="fill-accent" />
    <circle cx="200" cy="122" r="5" className="fill-ink/40" />
    <text x="160" y="72" textAnchor="middle" className="fill-ink font-pixel text-[11px]">
      SC-OS
    </text>
    <text x="160" y="166" textAnchor="middle" className="blink fill-accent font-pixel text-[7px]">
      PRESS START
    </text>
  </g>,
];

// Portfolio website: a tiny version of this site, flipping between its three hobby skins. (CSS-animated)
export default function MiniHub() {
  return (
    <g>
      <rect x="44" y="14" width="232" height="172" rx="12" strokeWidth="1.5" className="fill-[#121310] stroke-ink/20" />
      {[56, 65, 74].map((cx) => (
        <circle key={cx} cx={cx} cy="25" r="2.5" className="fill-ink/25" />
      ))}
      <rect x="130" y="34" width="60" height="12" rx="6" className="fill-[#1d1e1a]" />
      {[145, 160, 175].map((cx) => (
        <circle key={cx} cx={cx} cy="40" r="2" className="fill-ink/30" />
      ))}
      <circle cx="145" cy="40" r="3.2" className="mh-dot fill-accent" />
      {scenes.map((scene, i) => (
        <g key={i} className="mh-scene" style={{ animationDelay: `${[0, -6, -3][i]}s` }}>
          {scene}
        </g>
      ))}
    </g>
  );
}
