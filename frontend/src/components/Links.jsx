import { useState } from "react";

const DEFAULT_LINKS = [
  { id: 1, title: "PathPilot (Live)", url: "https://path-pilot-rho.vercel.app", category: "Projects", notes: "Your deployed app" },
  { id: 2, title: "PathPilot GitHub", url: "https://github.com/Cyrila7/PathPilot", category: "Projects", notes: "" },
  { id: 3, title: "NeetCode 150", url: "https://neetcode.io/roadmap", category: "DSA", notes: "Main DSA roadmap" },
  { id: 4, title: "LeetCode", url: "https://leetcode.com", category: "DSA", notes: "" },
  { id: 5, title: "SimplifyJobs Summer 2027", url: "https://github.com/SimplifyJobs/Summer2027-Internships", category: "Jobs", notes: "Updated daily — bookmark this" },
  { id: 6, title: "CUNYStartups", url: "https://cunystartups.com/accelerator", category: "Programs", notes: "NVA 2 opens Fall 2026" },
  { id: 7, title: "Neo Scholars", url: "https://neo.com/scholars", category: "Programs", notes: "Applied June 14" },
  { id: 8, title: "IBM AI Challenge", url: "https://ibmskillsbuildchallenge.bemyapp.com", category: "Programs", notes: "July & August sprints" },
  { id: 9, title: "Google Careers", url: "https://careers.google.com/jobs/results/?category=ENGINEERING", category: "Jobs", notes: "Opens Aug-Sep 2026" },
  { id: 10, title: "Bloomberg Careers", url: "https://bloomberg.com/company/careers/working-here/engineering", category: "Jobs", notes: "Opens July — priority" },
];

const CATS = ["All", "Projects", "DSA", "Jobs", "Programs", "Other"];

export default function Links() {
  const [links, setLinks] = useState(() => JSON.parse(localStorage.getItem("links") || JSON.stringify(DEFAULT_LINKS)));
  const [cat, setCat] = useState("All");
  const [form, setForm] = useState({ title: "", url: "", category: "Jobs", notes: "" });
  const [search, setSearch] = useState("");

  const save = (u) => { setLinks(u); localStorage.setItem("links", JSON.stringify(u)); };

  const add = () => {
    if (!form.title || !form.url) return alert("Title and URL required");
    let url = form.url;
    if (!url.startsWith("http")) url = "https://" + url;
    save([{ ...form, url, id: Date.now() }, ...links]);
    setForm({ title: "", url: "", category: "Jobs", notes: "" });
  };

  const del = (id) => { if (confirm("Remove link?")) save(links.filter((l) => l.id !== id)); };

  const filtered = links.filter((l) => {
    if (cat !== "All" && l.category !== cat) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <h2>🔗 Links</h2>
        <p>{links.length} saved links</p>
      </div>

      {/* Add link */}
      <div className="card mb-16">
        <div className="section-label mb-16">Add Link</div>
        <div className="grid-2 gap-16">
          <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="input" placeholder="https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATS.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
          </select>
          <input className="input" placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <button className="btn btn-primary mt-16" onClick={add}>Save Link</button>
      </div>

      {/* Filters */}
      <div className="flex gap-8 mb-16" style={{ flexWrap: "wrap", alignItems: "center" }}>
        <input className="input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        {CATS.map((c) => (
          <button key={c} className={`btn btn-sm ${cat === c ? "btn-primary" : "btn-ghost"}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {/* Link Grid */}
      <div className="grid-2 gap-16">
        {filtered.map((l) => (
          <div key={l.id} className="card-sm">
            <div className="flex-between mb-8">
              <span className="tag">{l.category}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => del(l.id)}>🗑️</button>
            </div>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
              <a href={l.url} target="_blank" rel="noreferrer" style={{ color: "var(--text)", textDecoration: "none" }}>{l.title}</a>
            </h4>
            <p style={{ fontSize: 11, color: "var(--accent)", marginBottom: l.notes ? 6 : 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.url}</p>
            {l.notes && <p style={{ fontSize: 11, color: "var(--muted)" }}>{l.notes}</p>}
            <a href={l.url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ marginTop: 10 }}>Open →</a>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>No links found.</p>}
      </div>
    </div>
  );
}
