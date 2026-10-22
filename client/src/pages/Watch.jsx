import { useState, useEffect } from "react";
import { VIDEOS } from "../data";
import { Avatar, Skyline } from "../components/ui";
const Watch = ({ v, open }) => {
  const [playing, setPlaying] = useState(false);
  const [pct, setPct] = useState(12);
  const [theater, setTheater] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [subbed, setSubbed] = useState(false);
  const [more, setMore] = useState(false);
  const [text, setText] = useState("");
  const [comments, setComments] = useState([
    { id: 1, name: "Tokyo Byte", init: "TB", when: "17 hours ago", body: "I have a more interactive comments section coming soon, tell me what you want to see.", likes: 13, replies: [
      { id: 11, name: "Tokyo Byte", init: "TB", when: "1 hour ago", body: "@Kaclamerinbyte Modern city design is the heart of this series." },
    ] },
    { id: 2, name: "Kaclamer", init: "WF", when: "3 hours ago", body: "The skyline shots in the second half are unreal. More of this please.", likes: 3, replies: [] },
  ]);
  const [openReplies, setOpenReplies] = useState({ 1: true });

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setPct((p) => (p >= 100 ? (setPlaying(false), 100) : p + 0.5)), 250);
    return () => clearInterval(t);
  }, [playing]);

  const add = () => {
    if (!text.trim()) return;
    setComments([{ id: Date.now(), name: "You", init: "SN", when: "just now", body: text.trim(), likes: 0, replies: [] }, ...comments]);
    setText("");
  };
  const total = 19 * 60 + 26, cur = Math.round((pct / 100) * total);
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const next = VIDEOS.filter((x) => x.id !== v.id).slice(0, 4);

  return (
    <div className={"watch" + (theater ? " theater" : "")}>
      <div style={{ minWidth: 0 }}>
        <div className="player">
          <Skyline />
          <div className="ctrl">
            <button className="cbtn" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying(!playing)}>
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d={playing ? "M7 5h4v14H7zM13 5h4v14h-4z" : "M8 5v14l11-7z"} fill="#fff" /></svg>
            </button>
            <div className="bar" role="slider" aria-label="Seek" aria-valuenow={Math.round(pct)} tabIndex={0}
              onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPct(((e.clientX - r.left) / r.width) * 100); }}
              onKeyDown={(e) => { if (e.key === "ArrowRight") setPct((p) => Math.min(100, p + 5)); if (e.key === "ArrowLeft") setPct((p) => Math.max(0, p - 5)); }}>
              <i style={{ width: pct + "%" }} />
            </div>
            <span>{fmt(cur)} / {fmt(total)}</span>
            <button className="cbtn" style={{ color: "#fff", fontSize: 13 }} onClick={() => setTheater(!theater)}>{theater ? "Default view" : "Theater mode"}</button>
          </div>
        </div>

        <h1 style={{ fontSize: 28, margin: "18px 0 12px", lineHeight: 1.2 }}>{v.title}</h1>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div className="row" style={{ alignItems: "center" }}>
            <Avatar init={v.init} size={44} />
            <div><div className="tt">{v.ch}</div><div className="mt">520K subscribers</div></div>
            <button className={"btn" + (subbed ? "" : " on")} onClick={() => setSubbed(!subbed)} style={{ marginLeft: 8 }}>{subbed ? "Subscribed" : "Subscribe"}</button>
          </div>
          <div className="row">
            <button className={"btn" + (liked ? " on" : "")} aria-pressed={liked} onClick={() => setLiked(!liked)}>{liked ? "Liked" : "Like"} · {liked ? "12.4K" : "12.3K"}</button>
            <button className={"btn" + (saved ? " on" : "")} aria-pressed={saved} onClick={() => setSaved(!saved)}>{saved ? "Saved" : "Save"}</button>
            <button className="btn">Share</button>
          </div>
        </div>

        <div className="panel" style={{ marginTop: 18 }}>
          <div className="tt">{v.views} views · {v.age}</div>
          <p style={{ color: "var(--mt)", lineHeight: 1.6, margin: "8px 0 0", maxWidth: 720 }}>
            A walk through the districts, transit lines and street-level design choices shaping the next generation of megacities.
            {more && " Part one covers the waterfront, part two the vertical neighbourhoods, and part three how residents actually move through them."}
          </p>
          <button className="btn" style={{ height: 36, marginTop: 12 }} onClick={() => setMore(!more)}>{more ? "Show less" : "Show more"}</button>
        </div>

        <h2 style={{ fontSize: 22, margin: "28px 0 4px" }}>{comments.length + 1} Comments</h2>
        <div className="cmt">
          <Avatar init="SN" />
          <div style={{ flex: 1, display: "flex", gap: 10 }}>
            <input aria-label="Add a comment" placeholder="Add a comment..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()}
              style={{ flex: 1, height: 44, borderRadius: 22, border: "1px solid var(--bd)", background: "var(--sf)", padding: "0 18px" }} />
            <button className="btn on" onClick={add}>Comment</button>
          </div>
        </div>
        {comments.map((c) => (
          <div key={c.id} className="cmt">
            <Avatar init={c.init} />
            <div style={{ minWidth: 0 }}>
              <div className="tt">{c.name} <span className="mt">{c.when}</span></div>
              <div style={{ margin: "4px 0", lineHeight: 1.5 }}>{c.body}</div>
              <div className="mt">{c.likes} likes · Reply</div>
              {c.replies.length > 0 && (
                <button className="btn" style={{ height: 32, marginTop: 8, color: "var(--ac)" }} onClick={() => setOpenReplies({ ...openReplies, [c.id]: !openReplies[c.id] })}>
                  {openReplies[c.id] ? "Hide replies" : `Show ${c.replies.length} reply`}
                </button>
              )}
              {openReplies[c.id] && c.replies.map((r) => (
                <div key={r.id} className="cmt"><Avatar init={r.init} size={30} /><div><div className="tt">{r.name} <span className="mt">{r.when}</span></div><div style={{ lineHeight: 1.5 }}>{r.body}</div></div></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!theater && (
        <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 20, marginBottom: 14 }}>Up Next</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {next.slice(0, 3).map((x) => (
                <button key={x.id} className="q" onClick={() => open(x)}>
                  <div className="th" style={{ background: x.g }}><span className="dur">{x.dur}</span></div>
                  <div><div className="tt" style={{ fontSize: 14 }}>{x.title}</div><div className="mt">{x.ch} · {x.views} views</div></div>
                </button>
              ))}
            </div>
          </div>
          <div className="panel">
            <h3 style={{ fontSize: 20, marginBottom: 4 }}>Playlist Queue</h3>
            <div className="mt" style={{ marginBottom: 14 }}>Future Cities · 4 videos</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {next.map((x, i) => (
                <button key={x.id} className="q" onClick={() => open(x)}>
                  <div className="mt" style={{ width: 16, paddingTop: 4 }}>{i + 1}</div>
                  <div className="th" style={{ background: x.g, width: 110, height: 62 }}><span className="dur">{x.dur}</span></div>
                  <div className="tt" style={{ fontSize: 13 }}>{x.title}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default Watch;
