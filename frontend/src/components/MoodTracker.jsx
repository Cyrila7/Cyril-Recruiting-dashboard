import { useState } from "react";

const MOODS = [
  { emoji: "🔥", label: "In the zone", value: 5 },
  { emoji: "💪", label: "Focused", value: 4 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "😓", label: "Tired", value: 2 },
  { emoji: "😔", label: "Struggling", value: 1 },
];

export default function MoodTracker() {
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem("mood") || "[]"));
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");

  const save = (u) => { setLogs(u); localStorage.setItem("mood", JSON.stringify(u)); };

  const logMood = () => {
    if (!selected) return;
    const today = new Date().toLocaleDateString();
    const entry = { id: Date.now(), date: today, mood: selected, note };
    save([entry, ...logs]);
    setSelected(null); setNote("");
  };

  const del = (id) => save(logs.filter((l) => l.id !== id));

  const avg = logs.length ? (logs.slice(0, 7).reduce((s, l) => s + l.mood.value, 0) / Math.min(logs.length, 7)).toFixed(1) : "—";

  return (
    <div>
      <div className="page-header">
        <h2>🌡️ Mood Tracker</h2>
        <p>7-day average: {avg} · {logs.length} entries total</p>
      </div>

      <div className="grid-2 gap-16">
        {/* Log mood */}
        <div className="card">
          <div className="section-label mb-16">How are you feeling today?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
            {MOODS.map((m) => (
              <div
                key={m.value}
                className={`mood-btn ${selected?.value === m.value ? "selected" : ""}`}
                onClick={() => setSelected(m)}
              >
                <div>{m.emoji}</div>
                <p>{m.label}</p>
              </div>
            ))}
          </div>
          <textarea
            className="textarea"
            placeholder="Optional note — what's on your mind?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ minHeight: 80, marginBottom: 12 }}
          />
          <button className="btn btn-primary" onClick={logMood} disabled={!selected} style={{ opacity: selected ? 1 : 0.5 }}>
            Log Mood
          </button>
        </div>

        {/* Trend */}
        <div className="card">
          <div className="section-label mb-16">Last 7 Days</div>
          {logs.slice(0, 7).length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>No entries yet. Start logging.</p>}
          {logs.slice(0, 7).map((l) => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 22 }}>{l.mood.emoji}</span>
              <div style={{ flex: 1 }}>
                <div className="flex-between">
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{l.mood.label}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{l.date}</span>
                </div>
                {l.note && <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{l.note}</p>}
              </div>
              <div className="progress-wrap" style={{ width: 60 }}>
                <div className="progress-fill" style={{ width: `${(l.mood.value / 5) * 100}%` }} />
              </div>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 12 }} onClick={() => del(l.id)}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
