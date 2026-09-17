const NODES = [
  { x: 70, y: 120, label: 'CLIENT' },
  { x: 250, y: 60, label: 'GATEWAY' },
  { x: 430, y: 120, label: 'API' },
  { x: 610, y: 60, label: 'WORKER' },
  { x: 790, y: 120, label: 'DATABASE' },
];

const ROUTES = [
  'M70 120 L250 60 L430 120 L610 60 L790 120',
  'M70 120 L250 180 L430 120 L610 180 L790 120',
];

// A decorative SVG keeps the animation lightweight and resolution-independent.
const HeroNetwork = () => (
  <div className="hero-network relative w-full max-w-3xl mx-auto mb-10 rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="flex justify-between px-4 pt-4 font-mono text-[10px] tracking-widest text-slate-400">
      <span>PACKET / ROUTING</span>
      <span className="text-emerald-400">● CONNECTED</span>
    </div>
    <svg viewBox="0 0 860 240" className="block w-full h-36 sm:h-44" fill="none">
      {ROUTES.map((path, index) => (
        <g key={path}>
          <path d={path} stroke={index === 0 ? '#34d399' : '#64748b'} strokeOpacity={index === 0 ? '0.35' : '0.2'} />
          <circle className="network-packet" r="4" fill="#6ee7b7">
            <animateMotion path={path} dur={`${7 + index * 3}s`} begin={`${index * -4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {NODES.map(({ x, y, label }) => (
        <g key={label}>
          <circle cx={x} cy={y} r="13" fill="#34d399" fillOpacity="0.06" />
          <circle cx={x} cy={y} r="4" fill="#6ee7b7" />
          <text x={x} y={y + 32} textAnchor="middle" fill="#94a3b8" fontFamily="monospace" fontSize="10" letterSpacing="1.5">{label}</text>
        </g>
      ))}
      <circle cx="250" cy="180" r="3" fill="#64748b" />
      <circle cx="610" cy="180" r="3" fill="#64748b" />
    </svg>
  </div>
);

export default HeroNetwork;
