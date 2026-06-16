import { useState } from "react";
import { COMPANIES } from "../data/companies";

function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((new Date(dateStr) - today) / (1000*60*60*24));
}

const TIER_BADGE = {
  "Big Tech": "badge-bigtec",
  "Strong Tech": "badge-strong",
  "Fintech/Banks": "badge-fintech",
  "NYC Startups": "badge-nyc",
  "Well-Funded Startups": "badge-well",
  "Great Targets": "badge-great",
};

const TIERS = ["All", "Big Tech", "Strong Tech", "Fintech/Banks", "NYC Startups", "Well-Funded Startups", "Great Targets"];
const STATUSES = ["All", "Not Applied", "Applied", "OA", "Interview", "Offer", "Rejected"];
const RESULTS = ["", "offer", "rejected", "withdrawn"];

const BLANK = { tier: "Big Tech", company: "", role: "SWE Intern", opens: "2026-08-01", url: "", priority: 2, notes: "", applied: false, oa: false, interview: false, result: "" };

export default function CareerTracker() {
  const [companies, setCompanies] = useState(() => {
    const s = localStorage.getItem("companies");
    return s ? JSON.parse(s) : COMPANIES;
  });
  const [tier, setTier] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);

  const save = (updated) => {
    setCompanies(updated);
    localStorage.setItem("companies", JSON.stringify(updated));
  };

  const toggle = (id, field) => {
    save(companies.map((c) => c.id === id ? { ...c, [field]: !c[field] } : c));
  };

  const setResult = (id, val) => {
    save(companies.map((c) => c.id === id ? { ...c, result: val } : c));
  };

  const deleteCompany = (id) => {
    if (confirm("Delete this company?")) save(companies.filter((c) => c.id !== id));
  };

  const submitForm = () => {
    if (!form.company.trim()) return alert("Company name required");
    if (editId !== null) {
      save(companies.map((c) => c.id === editId ? { ...form, id: editId } : c));
      setEditId(null);
    } else {
      const newId = Math.max(...companies.map((c) => c.id)) + 1;
      save([...companies, { ...form, id: newId }]);
    }
    setForm(BLANK);
    setShowAdd(false);
  };

  const startEdit = (c) => {
    setForm({ ...c });
    setEditId(c.id);
    setShowAdd(true);
  };

  const filtered = companies.filter((c) => {
    if (tier !== "All" && c.tier !== tier) return false;
    if (search && !c.company.toLowerCase().includes(search.toLowerCase())) return false;
    if (status === "Not Applied") return !c.applied;
    if (status === "Applied") return c.applied && !c.oa;
    if (status === "OA") return c.oa && !c.interview;
    if (status === "Interview") return c.interview;
    if (status === "Offer") return c.result === "offer";
    if (status === "Rejected") return c.result === "rejected";
    return true;
  });

  const applied = companies.filter((c) => c.applied).length;

  return (
    <div>
      <div className="page-header flex-between">
        <div>
          <h2>🎯 Career Tracker</h2>
          <p>{applied} applied · {companies.length} total companies</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(BLANK); setEditId(null); setShowAdd(true); }}>+ Add Company</button>
      </div>

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="card mb-16" style={{ borderColor: "var(--accent)" }}>
          <div className="flex-between mb-16">
            <h3 style={{ fontSize: 15 }}>{editId !== null ? "Edit Company" : "Add Company"}</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => { setShowAdd(false); setEditId(null); }}>✕</button>
          </div>
          <div className="grid-2 gap-16">
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Company *</label>
              <input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Google" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Role</label>
              <input className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="SWE Intern" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Tier</label>
              <select className="select" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
                {TIERS.filter((t) => t !== "All").map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Opens</label>
              <input className="input" type="date" value={form.opens} onChange={(e) => setForm({ ...form, opens: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Career Page URL</label>
              <input className="input" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="careers.company.com" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Priority</label>
              <select className="select" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}>
                <option value={1}>⭐ Low</option>
                <option value={2}>⭐⭐ Medium</option>
                <option value={3}>⭐⭐⭐ High</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Notes</label>
            <textarea className="textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Warm lead, Java match, etc." style={{ minHeight: 60 }} />
          </div>
          <div className="flex gap-8 mt-16">
            <button className="btn btn-primary" onClick={submitForm}>{editId !== null ? "Save Changes" : "Add Company"}</button>
            <button className="btn btn-ghost" onClick={() => { setShowAdd(false); setEditId(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-16">
        <div className="flex gap-8" style={{ flexWrap: "wrap", alignItems: "center" }}>
          <input className="input" style={{ width: 200 }} placeholder="Search company..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="select" style={{ width: 160 }} value={tier} onChange={(e) => setTier(e.target.value)}>
            {TIERS.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className="select" style={{ width: 140 }} value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{filtered.length} companies</span>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Company</th>
              <th>Tier</th>
              <th>Opens</th>
              <th>Applied</th>
              <th>OA</th>
              <th>Interview</th>
              <th>Result</th>
              <th>Priority</th>
              <th>Notes</th>
              <th>Link</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const days = daysUntil(c.opens);
              let dayLabel = days <= 0 ? "🟢 Open" : days <= 14 ? `🔴 ${days}d` : days <= 30 ? `🟡 ${days}d` : `${days}d`;
              return (
                <tr key={c.id}>
                  <td className="mono" style={{ color: "var(--muted)", fontSize: 11 }}>{c.id}</td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{c.company}</td>
                  <td><span className={`badge ${TIER_BADGE[c.tier] || "badge-great"}`}>{c.tier.replace(" Startups","").replace("Well-Funded","WF")}</span></td>
                  <td className="mono" style={{ fontSize: 11 }}>{dayLabel}</td>
                  <td><input type="checkbox" className="check" checked={c.applied} onChange={() => toggle(c.id, "applied")} /></td>
                  <td><input type="checkbox" className="check" checked={c.oa} onChange={() => toggle(c.id, "oa")} /></td>
                  <td><input type="checkbox" className="check" checked={c.interview} onChange={() => toggle(c.id, "interview")} /></td>
                  <td>
                    <select className="select" style={{ padding: "3px 6px", fontSize: 11, width: 90 }} value={c.result} onChange={(e) => setResult(c.id, e.target.value)}>
                      {RESULTS.map((r) => <option key={r} value={r}>{r || "—"}</option>)}
                    </select>
                  </td>
                  <td>{"⭐".repeat(c.priority)}</td>
                  <td style={{ fontSize: 11, color: "var(--muted)", maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.notes}</td>
                  <td>
                    {c.url ? (
                      <a href={`https://${c.url.replace("https://","").replace("http://","")}`} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontSize: 11 }}>Open →</a>
                    ) : "—"}
                  </td>
                  <td>
                    <div className="flex gap-8">
                      <button className="btn btn-ghost btn-sm" onClick={() => startEdit(c)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteCompany(c.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
