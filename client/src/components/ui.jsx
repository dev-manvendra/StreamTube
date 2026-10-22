import { AVATAR_BG } from "../data";

export const Icon = ({ d, ...p }) => (
  <svg className="icn" aria-hidden="true" viewBox="0 0 24 24" {...p}>
    {d.map((x, i) => <path key={i} d={x} />)}
  </svg>
);
export const ICONS = {
  home: ["M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"],
  subs: ["M3 7h18v10H3zM8 21h8"],
  explore: ["M12 3a9 9 0 100 18 9 9 0 000-18zM15 9l-2 6-4 0 2-6z"],
  library: ["M4 5h16M4 10h16M4 15h10M17 14v6l4-3z"],
  studio: ["M4 20V10M10 20V4M16 20v-8M22 20H2"],
  search: ["M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4"],
  plus: ["M12 5v14M5 12h14"],
  bell: ["M6 17V11a6 6 0 0112 0v6l2 2H4zM10 21h4"],
  up: ["M12 16V4M7 9l5-5 5 5M4 20h16"],
  like: ["M7 11v9H4v-9zM7 11l4-8c2 0 3 1 3 3l-1 4h6l-1 8H7"],
};

export const Skyline = ({ cls = "sky" }) => (
  <svg className={cls} aria-hidden="true" viewBox="0 0 1200 460" preserveAspectRatio="xMidYMax slice">
    <circle cx="900" cy="150" r="70" fill="#F2B84B" opacity=".85" />
    <g fill="#120C2B">
      {[[40,220,90],[150,150,70],[240,250,110],[370,120,80],[470,200,100],[590,90,90],[700,230,120],[840,170,80],[940,110,100],[1060,240,110]].map(([x, y, w], i) => (
        <rect key={i} x={x} y={y} width={w} height={460 - y} />
      ))}
    </g>
    <g fill="#3AE0D0" opacity=".9">{[[160,180],[380,150],[600,130],[950,150]].map(([x, y], i) => <rect key={i} x={x} y={y} width="10" height="6" />)}</g>
    <g fill="#E0526F" opacity=".9">{[[195,240],[420,220],[640,200],[990,230],[860,220]].map(([x, y], i) => <rect key={i} x={x} y={y} width="10" height="6" />)}</g>
  </svg>
);

export const Avatar = ({ init, size }) => (
  <div className="av" style={{ background: AVATAR_BG[init] || "#8B6CF0", ...(size ? { width: size, height: size } : {}) }}>{init}</div>
);

export const VideoCard = ({ v, onOpen, tall }) => (
  <button className="card" onClick={() => onOpen(v)}>
    <div className="th" style={{ background: v.g, height: tall ? 230 : 170 }}>
      {v.badge && <span className="bdg">{v.badge}</span>}
      <span className="dur">{v.dur}</span>
    </div>
    <div className="row">
      <Avatar init={v.init} />
      <div>
        <div className="tt">{v.title}</div>
        <div className="mt">{v.ch} · {v.views} views · {v.age}</div>
      </div>
    </div>
  </button>
);

