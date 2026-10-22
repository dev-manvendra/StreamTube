import { useState, useMemo } from "react";
import { VIDEOS, CHIPS } from "../data";
import { Avatar, VideoCard, Skyline } from "../components/ui";
const Home = ({ q, open }) => {
  const [chip, setChip] = useState("All");
  const list = useMemo(
    () => VIDEOS.filter((v) => (chip === "All" || v.cat === chip) && (v.title + v.ch).toLowerCase().includes(q.toLowerCase())),
    [chip, q]
  );
  const hero = VIDEOS[0];
  return (
    <>
      <div className="chips" role="tablist">
        {CHIPS.map((c) => (
          <button key={c} className={"btn" + (chip === c ? " on" : "")} aria-pressed={chip === c} onClick={() => setChip(c)}>{c}</button>
        ))}
      </div>

      {chip === "All" && !q && (
        <section>
          <div className="hero">
            <Skyline /><div className="fade" />
            <span className="bdg" style={{ left: 24, top: 24, padding: "5px 12px", fontSize: 13 }}>Staff Pick</span>
            <button className="play" aria-label="Play featured video" onClick={() => open(hero)}>
              <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
            </button>
            <span className="dur" style={{ right: 20, bottom: 20, fontSize: 13 }}>{hero.dur}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginTop: 18 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h1 style={{ fontSize: 36, lineHeight: 1.15 }}>{hero.title}</h1>
              <div className="row" style={{ alignItems: "center" }}>
                <Avatar init="TB" />
                <div><div className="tt">{hero.ch}</div><div className="mt">{hero.views} views · {hero.age} · 4K</div></div>
              </div>
            </div>
            <div className="row"><button className="btn on" onClick={() => open(hero)}>Watch now</button><button className="btn">Save</button><button className="btn">Share</button></div>
          </div>
        </section>
      )}

      <section>
        <div className="sec"><h2>{chip === "All" ? "Curated Row" : chip}</h2><button>See all</button></div>
        {list.length === 0 ? (
          <p className="mt">No videos match. Try a different topic or clear the search.</p>
        ) : (
          <div className="grid3">{list.slice(0, 6).map((v) => <VideoCard key={v.id} v={v} onOpen={open} />)}</div>
        )}
      </section>

      {chip === "All" && !q && (
        <section>
          <div className="sec"><h2>Category Inset</h2><button>Browse categories</button></div>
          <div className="grid3">
            <div className="inset">
              <div>
                <h3 style={{ fontSize: 30, margin: "0 0 10px" }}>Deep Dives</h3>
                <p style={{ margin: 0, color: "var(--mt)", lineHeight: 1.55 }}>Long-form channels that take a single idea apart, from city design to the code behind your favourite apps.</p>
              </div>
              <button className="btn on" style={{ alignSelf: "flex-start" }}>Read more</button>
            </div>
            <VideoCard v={VIDEOS[7]} onOpen={open} tall />
            <VideoCard v={VIDEOS[8]} onOpen={open} tall />
          </div>
        </section>
      )}

      {chip === "All" && !q && (
        <section>
          <div className="sec"><h2>Because you watched Web Dev</h2><button>See all</button></div>
          <div className="grid3">{[VIDEOS[4], VIDEOS[5], VIDEOS[6]].map((v) => <VideoCard key={v.id} v={v} onOpen={open} />)}</div>
        </section>
      )}
    </>
  );
};

export default Home;
