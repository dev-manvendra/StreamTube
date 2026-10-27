import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Icon, ICONS } from "./ui";
import React, {useState} from "react";
import axios from "axios";

const NAV = [
  ["home", "Home", "/"],
  ["subs", "Subs", "/subs"],
  ["explore", "Explore", "/explore"],
  ["library", "Library", "/library"],
  ["studio", "Studio", "/studio"],
];
export const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation();

  return (
    <nav
      onMouseEnter={()=>setIsExpanded(true)}
      onMouseLeave={()=>setIsExpanded(false)}
      className={`h-full bg-gray-900 text-white transition-all duration-300 flex flex-col pl-2 border-r border-[#0E1014] ${
        isExpanded ? "w-60" : "w-18"
      }`}
      aria-label="Primary"
    >
      {/* Header with Hamburger Menu Button */}
      <div 
      
      className="flex items-center h-20 gap-4 px-2 py-3 mb-2">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}

          className={`p-2  text-gray-300 cursor-pointer hover:text-white border-transparent rounded-full hover:bg-gray-800 transition-colors focus:outline-none `}
          aria-label="Toggle navigation drawer"
        >
          <svg
            className="w-6 h-6 overflow-visible"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            {/* Top Line: starts at 60% length, stretches to 100% */}
            <line
              x1="3"
              y1="6"
              x2="21"
              y2="6"
              strokeLinecap="round"
              className={`transition-transform duration-300 origin-left ${
                isExpanded ? "scale-x-100" : "scale-x-[0.6]"
              }`}
            />
            {/* Middle Line: starts at 80% length, stretches to 100% */}
            <line
              x1="3"
              y1="12"
              x2="21"
              y2="12"
              strokeLinecap="round"
              className={`transition-transform duration-300 origin-left ${
                isExpanded ? "scale-x-100" : "scale-x-[0.8]"
              }`}
            />
            {/* Bottom Line: starts at 40% length, stretches to 100% */}
            <line
              x1="3"
              y1="18"
              x2="21"
              y2="18"
              strokeLinecap="round"
              className={`transition-transform duration-300 origin-left ${
                isExpanded ? "scale-x-100" : "scale-x-[0.4]"
              }`}
            />
          </svg>
        </button>
        {isExpanded && <img
        onClick={()=> navigate("/home")}
         className="h-12 w-auto  cursor-pointer object-contain transition-transform hover:scale-105"
         src="/StreamTube.png" alt="logo2" />}
      </div>

      {/* Navigation Links */}
      <div className=" flex flex-col gap-1">
        {NAV.map(([k, l, path]) => {
          const isActive =
            pathname === path || (k === "home" && pathname.startsWith("/watch"));

          return (
            <NavLink
              key={k}
              to={path}
              end={path === "/"}
             className={({ isActive: linkActive }) =>
                `relative flex w-full h-15 items-center gap-6 px-3 py-3
                transition-colors
                ${
                  linkActive || isActive
                    ? "active-link bg-[#0E1014] text-[#E9B443]   font-medium"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                }
                ${!isExpanded
                  ? "flex-col justify-center text-[10px] gap-1 p-2"
                  : "text-sm"
                }`
              }
            >
              {(isActive) && (
                  <span className=" absolute left-0 top-1/2 -translate-y-1/2
                  h-6 w-0.75 rounded-r-full bg-[#E9B443]" />
                )}
              <div className=" text-xl">
                <Icon d={ICONS[k]} />
              </div>
              {isExpanded &&<span className="truncate">{l}</span>}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export const TopBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
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

  const getUser = async() =>{
    let user;
    try {
      user = await axios.post("/api/v1/users/current-user")
      console.log(user);
      
    } catch (error) {
      console.log(error)
      
    }
    return user;
  }

 return (
    <header className="top">
      <img src="/logo.png"
      onClick={()=>{navigate("/home")}} 
      className="h-12 w-auto object-contain cursor-pointer transition-transform hover:scale-105" alt="Logo" />
      <div className="search">
        <Icon d={ICONS.search} />
        <input aria-label="Search" placeholder="Search videos, channels, topics" value={q} onChange={onSearch} />
      </div>
      {isLoggedIn? (<>
      {}
      
      </>): 
      (<> 
      <button className="create text-white hover:text-[#E9B443]!  cursor-pointer" aria-label="Create" onClick={() => navigate("/sign-up")}>Sign-Up</button>
      <span>/</span>
      <button className="create text-white hover:text-[#E9B443]! cursor-pointer" aria-label="Create" onClick={() => navigate("/sign-up")}>LogIn</button>
      </>)}

      <button className="ib" aria-label="Notifications, 4 new"><Icon d={ICONS.bell} /><span className="n">4</span></button>
    </header>
  );
};