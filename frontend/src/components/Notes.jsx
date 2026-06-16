import { useState } from "react";

const TAGS = ["General", "DSA", "Career", "PathPilot", "Ideas", "Follow-up"];

export default function Notes() {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes") || "[]"));
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("General");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [viewing, setViewing] = useState(null);

  const save = (updated) => { setNotes(updated); localStorage.setItem("notes", JSON.stringify(updated)); };

  const add = () => {
    if (!title.trim()) return;
    const n = { id: Date.now(), title, body, tag, created: new Date().toLocaleDateString() };
    save([n, ...notes]);
    setTitle(""); setBody(""); setTag("General");
  };

  const del = (id) => { if (confirm("Delete note?")) { save(notes.filter((n) => n.id !== id)); if (viewing?.id === id) setViewing(null); } };

  const filtered = notes.filter((n) => {
    if (activeTag !== "All" && n.tag !== activeTag) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.body.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <h2>📝 Notes</h2>
        <p>{notes.length} notes saved</p>
      </div>

      <div className="grid-2 gap-16">
        {/* New note */}
        <div className="card">
          <div className="section-label mb-16">New Note</div>
          <input className="input mb-16" placeholder="Title..." value={title} onChange={(e) => setTitle(e.target.value)} style={{ marginBottom: 10 }} />
          <textarea className="textarea" placeholder="Write anything — DSA patterns, ideas, follow-ups..." value={body} onChange={(e) => setBody(e.target.value)} style={{ minHeight: 120, marginBottom: 10 }} />
          <div className="flex gap-8 mt-8">
            <select className="select" value={tag} onChange={(e) => setTag(e.target.value)} style={{ flex: 1 }}>
              {TAGS.map((t) => <option key={t}>{t}</option>)}
            </select>
            <button className="btn btn-primary" onClick={add}>Save Note</button>
          </div>
        </div>

        {/* View note */}
        {viewing ? (
          <div className="card" style={{ borderColor: "var(--accent)" }}>
            <div className="flex-between mb-16">
              <span className="tag">{viewing.tag}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewing(null)}>✕</button>
            </div>
            <h3 style={{ fontSize: 16, marginBottom: 10 }}>{viewing.title}</h3>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{viewing.body}</p>
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 16 }}>{viewing.created}</p>
          </div>
        ) : (
          <div className="card">
            <div className="section-label mb-16">Quick Stats</div>
            {TAGS.map((t) => {
              const count = notes.filter((n) => n.tag === t).length;
              return count > 0 ? (
                <div key={t} className="flex-between" style={{ marginBottom: 8, fontSize: 13 }}>
                  <span>{t}</span>
                  <span className="mono" style={{ color: "var(--accent)" }}>{count}</span>
                </div>
              ) : null;
            })}
            {notes.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>No notes yet. Start writing.</p>}
          </div>
        )}
      </div>

      {/* Notes List */}
      <div className="mt-24">
        <div className="flex gap-8 mb-16" style={{ flexWrap: "wrap", alignItems: "center" }}>
          <input className="input" style={{ width: 220 }} placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {["All", ...TAGS].map((t) => (
            <button key={t} className={`btn btn-sm ${activeTag === t ? "btn-primary" : "btn-ghost"}`} onClick={() => setActiveTag(t)}>{t}</button>
          ))}
        </div>

        <div className="grid-2 gap-16">
          {filtered.map((n) => (
            <div key={n.id} className="card-sm" style={{ cursor: "pointer", borderColor: viewing?.id === n.id ? "var(--accent)" : "var(--border)" }} onClick={() => setViewing(n)}>
              <div className="flex-between mb-8">
                <span className="tag">{n.tag}</span>
                <div className="flex gap-8">
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{n.created}</span>
                  <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); del(n.id); }}>🗑️</button>
                </div>
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{n.title}</h4>
              <p style={{ fontSize: 12, color: "var(--muted)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{n.body}</p>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>No notes found.</p>}
        </div>
      </div>
    </div>
  );
}
