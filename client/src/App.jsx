import { useState } from "react";
import "./styles.css";
import { VIDEOS } from "./data";
import { Sidebar, TopBar } from "./components/Layout";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Studio from "./pages/Studio";

export default function App() {
  const [page, setPage] = useState("home");
  const [video, setVideo] = useState(VIDEOS[0]);
  const [q, setQ] = useState("");
  const open = (v) => { setVideo(v); setPage("watch"); window.scrollTo?.(0, 0); };
  const go = (p) => { setPage(p); if (p !== "home") setQ(""); };

  return (
    <div className="st">
      <Sidebar page={page} go={go} />
      <main className="main">
        <TopBar q={q} setQ={(v) => { setQ(v); if (page !== "home") setPage("home"); }} go={go} />
        {page === "home" && <Home q={q} open={open} />}
        {page === "watch" && <Watch key={video.id} v={video} open={open} />}
        {page === "studio" && <Studio />}
      </main>
    </div>
  );
}
