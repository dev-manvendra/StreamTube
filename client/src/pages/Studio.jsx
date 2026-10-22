import { useState, useEffect } from "react";
import { VIDEOS } from "../data";
import { Icon, ICONS } from "../components/ui";
const Spark = ({ pts, color }) => (
  <svg viewBox="0 0 100 30" width="100%" height="40" aria-hidden="true" preserveAspectRatio="none">
    <polyline points={pts.map((p, i) => `${(i / (pts.length - 1)) * 100},${30 - p}`).join(" ")} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
  </svg>
);

const Studio = () => {
  const [prog, setProg] = useState(0);
  const [running, setRunning] = useState(false);
  const [vis, setVis] = useState("Public");
  const [title, setTitle] = useState("Exploring Neo-Tokyo");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setProg((p) => (p >= 100 ? (setRunning(false), 100) : p + 4)), 200);
    return () => clearInterval(t);
  }, [running]);

  const sources = [["Search", 38], ["Browse", 26], ["Suggested", 21], ["External", 10], ["Other", 5]];
  return (
    <>
      <h1 style={{ fontSize: 34 }}>Studio</h1>
      <section className="stats" aria-label="Analytics">
        {[["Views", "2.4M", "+16%", [8, 12, 10, 18, 15, 24, 28], "#F2B84B"], ["Watch time", "148K hrs", "+10%", [10, 9, 14, 12, 20, 18, 25], "#3AA0A8"], ["Subscribers", "550K", "+3.2%", [5, 8, 9, 13, 14, 19, 22], "#8B6CF0"]].map(([l, n, d, p, c]) => (
          <div key={l} className="panel stat"><div className="mt">{l}</div><b>{n}</b> <span style={{ color: "#7FE0A6", fontSize: 13 }}>{d}</span><Spark pts={p} color={c} /></div>
        ))}
        <div className="panel">
          <div className="mt" style={{ marginBottom: 8 }}>Traffic sources</div>
          {sources.map(([n, v]) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, margin: "5px 0" }}>
              <span style={{ width: 62, color: "var(--mt)" }}>{n}</span>
              <div className="prog" style={{ height: 6 }}><i style={{ width: v * 2 + "%", background: "var(--tl)" }} /></div><span>{v}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid3" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
        <div className="up">
          <Icon d={ICONS.up} style={{ width: 40, height: 40, color: "var(--ac)" }} />
          <div className="tt">Drag and drop a video to upload</div>
          <div className="mt">MP4, MOV or WebM up to 8 GB</div>
          <div className="prog" role="progressbar" aria-valuenow={prog}><i style={{ width: prog + "%" }} /></div>
          <div className="mt">{prog === 0 ? "No file selected" : prog >= 100 ? "Upload complete" : `Uploading ${prog}%`}</div>
          <button className="btn on" onClick={() => { setProg(0); setRunning(true); setPublished(false); }}>{prog >= 100 ? "Upload another" : "Select file"}</button>
        </div>
        <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label className="fld">Title<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label className="fld">Description<textarea rows={3} placeholder="Tell viewers what this video is about" /></label>
          <label className="fld">Tags<input placeholder="city, design, future" /></label>
          <label className="fld">Visibility<select value={vis} onChange={(e) => setVis(e.target.value)}><option>Public</option><option>Unlisted</option><option>Private</option></select></label>
          <button className="btn on" disabled={prog < 100} style={{ opacity: prog < 100 ? 0.5 : 1 }} onClick={() => setPublished(true)}>{published ? "Published" : "Publish video"}</button>
        </div>
      </section>

      <section className="panel">
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>Recent Videos</h2>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead><tr><th>Video</th><th>Status</th><th>Views</th><th>Shared</th></tr></thead>
            <tbody>
              {[...(published ? [[title, "Public", "0", "0"]] : []), ...VIDEOS.slice(0, 4).map((v, i) => [v.title, "Published", v.views, ["15K", "9K", "6K", "4K"][i]])].map(([t, s, vw, sh], i) => (
                <tr key={i}><td>{t}</td><td><span className="pill">{s}</span></td><td>{vw}</td><td>{sh}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Studio;
