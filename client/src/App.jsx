import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar, TopBar } from "./components/Layout.jsx";

// Root layout: .st (grid + colour variables) > Sidebar + main > TopBar + page
export default function App() {
  const navigate = useNavigate();
  const open = (v) => {
    navigate(`/watch/${v.id}`);
    window.scrollTo?.(0, 0);
  };

  return (
    <div className="st">
      <Sidebar />
      <main className="main">
        <TopBar />
        <Outlet context={{ open }} />
      </main>
    </div>
  );
}