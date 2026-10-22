import { Icon, ICONS } from "./ui";

export const Sidebar = ({ page, go }) => (
  <nav className="side" aria-label="Primary">
    <div className="logo">S</div>
    {[["home", "Home"], ["subs", "Subs"], ["explore", "Explore"], ["library", "Library"], ["studio", "Studio"]].map(([k, l]) => (
      <button key={k} className={"nav" + ((page === k || (k === "home" && page === "watch")) ? " on" : "")}
        onClick={() => go(k === "studio" ? "studio" : "home")}>
        <Icon d={ICONS[k]} />{l}
      </button>
    ))}
  </nav>
);

export const TopBar = ({ q, setQ, go }) => (
  <header className="top">
    <button className="brand" onClick={() => go("home")}>StreamTube</button>
    <div className="search">
      <Icon d={ICONS.search} />
      <input aria-label="Search" placeholder="Search videos, channels, topics" value={q} onChange={(e) => setQ(e.target.value)} />
    </div>
    <button className="ib" aria-label="Create" onClick={() => go("studio")}><Icon d={ICONS.plus} /></button>
    <button className="ib" aria-label="Notifications, 4 new"><Icon d={ICONS.bell} /><span className="n">4</span></button>
    <div className="av" style={{ width: 44, height: 44, background: "linear-gradient(135deg,#F2B84B,#E0526F)" }}>AK</div>
  </header>
);

