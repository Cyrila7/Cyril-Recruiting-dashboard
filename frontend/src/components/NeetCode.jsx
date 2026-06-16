import { useState } from "react";
import { NEETCODE_150 } from "../data/companies";

const SECTIONS = ["All", "Arrays & Hashing", "Two Pointers", "Sliding Window", "Stack", "Binary Search", "Linked List", "Trees", "Tries", "Heap / Priority Queue", "Backtracking", "Graphs", "Advanced Graphs", "1-D Dynamic Programming", "2-D Dynamic Programming", "Greedy", "Intervals", "Math & Geometry", "Bit Manipulation"];
const STATUSES = ["not started", "in progress", "mastered"];
const STATUS_COLORS = { "not started": "var(--muted)", "in progress": "var(--yellow)", "mastered": "var(--green)" };
const DIFF_COLORS = { Easy: "var(--green)", Medium: "var(--yellow)", Hard: "var(--red)" };

export default function NeetCode() {
  const [problems, setProblems] = useState(() => {
    const s = localStorage.getItem("neetcode");
    return s ? JSON.parse(s) : NEETCODE_150;
  });
  const [section, setSection] = useState("All");
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState("");

  const save = (updated) => {
    setProblems(updated);
    localStorage.setItem("neetcode", JSON.stringify(updated));
  };

  const cycleStatus = (id) => {
    save(problems.map((p) => {
      if (p.id !== id) return p;
      const idx = STATUSES.indexOf(p.status);
      return { ...p, status: STATUSES[(idx + 1) % STATUSES.length] };
    }));
  };

  const saveNote = (id) => {
    save(problems.map((p) => p.id === id ? { ...p, notes: noteText } : p));
    setEditingNote(null);
  };

  const filtered = section === "All" ? problems : problems.filter((p) => p.section === section);
  const mastered = problems.filter((p) => p.status === "mastered").length;
  const inProgress = problems.filter((p) => p.status === "in progress").length;

  return (
    <div>
      <div className="page-header">
        <h2>💻 NeetCode 150</h2>
        <p>{mastered} mastered · {inProgress} in progress · {150 - mastered - inProgress} not started</p>
      </div>

      {/* Progress grid — collapsible by clicking a section */}
      <div className="grid-3 mb-16">
        {SECTIONS.filter((s) => s !== "All").map((sec) => {
          const total = problems.filter((p) => p.section === sec).length;
          const done = problems.filter((p) => p.section === sec && p.status === "mastered").length;
          const pct = total ? Math.round((done / total) * 100) : 0;
          return (
            <div
              key={sec}
              className="card-sm"
              style={{ cursor: "pointer", borderColor: section === sec ? "var(--accent)" : "var(--border)" }}
              onClick={() => setSection(section === sec ? "All" : sec)}
            >
              <div className="flex-between" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600 }}>{sec}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{done}/{total}</span>
              </div>
              <div className="progress-wrap">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter buttons — all 19 wrapped */}
      <div className="card mb-16" style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SECTIONS.map((s) => (
            <button
              key={s}
              className={`btn btn-sm ${section === s ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setSection(s)}
              style={{ fontSize: 11, padding: "4px 10px" }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Problem List */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Problem</th>
              <th>Section</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th>Notes / Pattern</th>
              <th>LeetCode</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="mono" style={{ color: "var(--muted)", fontSize: 11 }}>{p.leetcode}</td>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</td>
                <td style={{ fontSize: 11, color: "var(--muted)" }}>{p.section}</td>
                <td><span style={{ color: DIFF_COLORS[p.difficulty], fontSize: 12, fontWeight: 600 }}>{p.difficulty}</span></td>
                <td>
                  <button
                    className="btn btn-sm"
                    style={{ background: "transparent", border: `1px solid ${STATUS_COLORS[p.status]}`, color: STATUS_COLORS[p.status], minWidth: 90 }}
                    onClick={() => cycleStatus(p.id)}
                  >
                    {p.status}
                  </button>
                </td>
                <td style={{ minWidth: 200 }}>
                  {editingNote === p.id ? (
                    <div className="flex gap-8">
                      <input className="input" style={{ fontSize: 11 }} value={noteText} onChange={(e) => setNoteText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveNote(p.id)} autoFocus />
                      <button className="btn btn-success btn-sm" onClick={() => saveNote(p.id)}>✓</button>
                    </div>
                  ) : (
                    <span
                      style={{ fontSize: 11, color: p.notes ? "var(--text)" : "var(--muted)", cursor: "pointer" }}
                      onClick={() => { setEditingNote(p.id); setNoteText(p.notes || ""); }}
                    >
                      {p.notes || "click to add pattern note..."}
                    </span>
                  )}
                </td>
                <td>
                  <a href={`https://leetcode.com/problems/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontSize: 11 }}>Open →</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}