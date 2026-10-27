import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar, TopBar } from "./components/Layout.jsx";

export default function App() {
  const navigate = useNavigate();
  // 1. Add state for the sidebar expansion
  const [isExpanded, setIsExpanded] = useState(false);

  const open = (v) => {
    navigate(`/watch/${v.id}`);
    window.scrollTo?.(0, 0);
  }

  return (
    <div className={`st ${isExpanded ? "sidebar-expanded" : ""}`}>
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <main className="main">
        <TopBar />
        <Outlet context={{ open }} />
      </main>
    </div>
  );
}