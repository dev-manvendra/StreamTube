import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Icon, ICONS } from "./ui";

const NAV = [
  ["home", "Home", "/"],
  ["subs", "Subs", "/subs"],
  ["explore", "Explore", "/explore"],
  ["library", "Library", "/library"],
  ["studio", "Studio", "/studio"],
];

export const Sidebar = () => {
  const { pathname } = useLocation();
  return (
    <nav className="side" aria-label="Primary">
      <div className="logo">S</div>
      {NAV.map(([k, l, path]) => (
        <NavLink
          key={k}
          to={path}
          end={path === "/"}
          className={({ isActive }) =>
            "nav" + (isActive || (k === "home" && pathname.startsWith("/watch")) ? " on" : "")
          }
        >
          <Icon d={ICONS[k]} />
          {l}
        </NavLink>
      ))}
    </nav>
  );
};

export const TopBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const onSearch = (e) => {
    const value = e.target.value;
    if (pathname !== "/") {
      // search always shows results on the Home page
      navigate(value ? `/?q=${encodeURIComponent(value)}` : "/");
    } else {
      setSearchParams(value ? { q: value } : {}, { replace: true });
    }
  };

  return (
    <header className="top">
      <img src="/logo.png" className="h-9 w-auto object-contain transition-transform hover:scale-105" alt="Logo" />
      <button className="brand" onClick={() => navigate("/")}>StreamTube</button>
      <div className="search">
        <Icon d={ICONS.search} />
        <input aria-label="Search" placeholder="Search videos, channels, topics" value={q} onChange={onSearch} />
      </div>
      <button className="text-white cursor-pointer" aria-label="Create" onClick={() => navigate("/sign-up")}>Sign-Up</button>
      <button className="ib" aria-label="Notifications, 4 new"><Icon d={ICONS.bell} /><span className="n">4</span></button>
      <div className="av" style={{ width: 44, height: 44, background: "linear-gradient(135deg,#F2B84B,#E0526F)" }}>AK</div>
    </header>
  );
};