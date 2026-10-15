import { useState } from "react";

const KEY = "cyrilhq_applications_v1";
const STATUSES = ["Applied", "Under Review", "Passed Initial Screening", "Assessment Invited", "Assessment Completed", "Assessment Retake Available", "Video Interview Completed", "Interview", "Offer", "Rejected", "Role Filled", "Withdrawn"];
const load = () => { try { const value = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; } };
const identity = (r) => [r.company, r.role].map(v => String(v || "").trim().toLowerCase().replace(/\\s+/g, " ")).join("|");

// Supports quoted fields, escaped double quotes, commas, and newlines in CSV.
function parseCSV(text) {
  const records = []; let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); records.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (quoted) throw new Error("CSV has an unclosed quoted field");
  if (field || row.length) { row.push(field); records.push(row); }
  const headers = (records.shift() || []).map(x => x.trim().toLowerCase().replace(/^\ufeff/, ""));
  for (const name of ["company", "role", "status"]) if (!headers.includes(name)) throw new Error("Missing CSV column: " + name);
  return records.filter(r => r.some(Boolean)).map(values => Object.fromEntries(headers.map((h, i) => [h, (values[i] || "").trim()])));
}

export default function Applications() {
  const [items, setItems] = useState(load);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const save = updated => { setItems(updated); localStorage.setItem(KEY, JSON.stringify(updated)); };
  const update = (key, patch) => save(items.map(r => identity(r) === key ? { ...r, ...patch } : r));

  async function importFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const incoming = parseCSV(await file.text()).filter(r => r.company && r.role);
      if (!incoming.length) throw new Error("No applications found");
      if (!window.confirm(`Import ${incoming.length} application records? Existing records will only be updated when the incoming email date is the same or newer.`)) return;
      const map = new Map(items.map(r => [identity(r), r]));
      let added = 0, updated = 0, skipped = 0;
      for (const r of incoming) {
        if (!STATUSES.includes(r.status)) { skipped++; continue; }
        const key = identity(r), old = map.get(key);
        if (!old) { map.set(key, r); added++; }
        else if (!old.last_email_date || (r.last_email_date && r.last_email_date >= old.last_email_date)) {
          map.set(key, { ...old, ...r }); updated++;
        } else skipped++;
      }
      save([...map.values()]);
      setNotice(`Imported: ${added} new, ${updated} updated, ${skipped} skipped. Saved in this browser.`);
    } catch (e) { setNotice("Import failed: " + e.message); }
    finally { event.target.value = ""; }
  }

  const shown = items.filter(r => (filter === "All" || r.status === filter) && (r.company + " " + r.role).toLowerCase().includes(search.toLowerCase()));
  const rejected = items.filter(r => r.status === "Rejected").length;
  const active = items.filter(r => !["Rejected", "Role Filled", "Withdrawn"].includes(r.status)).length;
  return <div>
    <div className="page-header"><h2>📋 Applications</h2><p>{items.length} roles · {active} active or awaiting update · {rejected} rejected</p></div>
    <div className="card mb-16">
      <h3 style={{ marginBottom: 8 }}>Import email status audit</h3>
      <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 12 }}>Upload the CyrilHQ CSV audit. Each company + role is a separate application. No Gmail access or automatic email scanning happens in this page. Data is saved to this browser only.</p>
      <input aria-label="Import application CSV" type="file" accept=".csv,text/csv" onChange={importFile} />
      {notice && <p role="status" style={{ marginTop: 10, fontSize: 12 }}>{notice}</p>}
    </div>
    <div className="card mb-16 flex gap-8" style={{ flexWrap: "wrap" }}>
      <input className="input" placeholder="Search company or role" value={search} onChange={e => setSearch(e.target.value)} />
      <select className="select" value={filter} onChange={e => setFilter(e.target.value)}>
        <option>All</option>{STATUSES.map(s => <option key={s}>{s}</option>)}
      </select>
      <span style={{ color: "var(--muted)", fontSize: 12 }}>{shown.length} results</span>
    </div>
    <div className="table-wrap"><table><thead><tr><th>Company</th><th>Role</th><th>Status</th><th>Last email</th><th>Source</th></tr></thead>
      <tbody>{shown.map(r => <tr key={identity(r)}>
        <td style={{ fontWeight: 600 }}>{r.company}</td><td>{r.role}</td>
        <td><select className="select" style={{ minWidth: 175 }} value={r.status} onChange={e => update(identity(r), { status: e.target.value })}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}</select></td>
        <td>{r.last_email_date || "—"}</td><td>{r.source || "—"}</td>
      </tr>)}</tbody></table></div>
    {!items.length && <p style={{ color: "var(--muted)", marginTop: 12 }}>No applications imported yet. Start by uploading the audit CSV.</p>}
  </div>;
}
