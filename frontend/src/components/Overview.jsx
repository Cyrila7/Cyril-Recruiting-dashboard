import { COMPANIES, NEETCODE_150 } from "../data/companies";
import { useState, useEffect } from "react";

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function getUrgencyLabel(days) {
  if (days <= 0) return { label: "OPEN NOW", cls: "urgency-open" };
  if (days <= 14) return { label: `${days}d`, cls: "urgency-hot" };
  if (days <= 30) return { label: `${days}d`, cls: "urgency-soon" };
  return { label: `${days}d`, cls: "urgency-later" };
}

export default function Overview({ setActive }) {
  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem("companies");
    return saved ? JSON.parse(saved) : COMPANIES;
  });

  const [neet] = useState(() => {
    const saved = localStorage.getItem("neetcode");
    return saved ? JSON.parse(saved) : NEETCODE_150;
  });

  const applied = companies.filter((c) => c.applied).length;
  const interviews = companies.filter((c) => c.interview).length;
  const offers = companies.filter((c) => c.result === "offer").length;
  const mastered = neet.filter((p) => p.status === "mastered").length;

  const opening_soon = [...companies]
    .filter((c) => !c.applied)
    .map((c) => ({ ...c, days: daysUntil(c.opens) }))
    .filter((c) => c.days <= 30)
    .sort((a, b) => a.days - b.days)
    .slice(0, 8);

  const priority3 = companies.filter((c) => c.priority === 3 && !c.applied).slice(0, 5);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div>
      <div className="page-header">
        <h2>⚡ Overview</h2>
        <p>{today} · Keep going, Cyril.</p>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-16">
        <div className="stat-card">
          <div className="label">Applied</div>
          <div className="value" style={{ color: "var(--accent)" }}>{applied}</div>
          <div className="sub">of 100 companies</div>
        </div>
        <div className="stat-card">
          <div className="label">Interviews</div>
          <div className="value" style={{ color: "var(--accent3)" }}>{interviews}</div>
          <div className="sub">active conversations</div>
        </div>
        <div className="stat-card">
          <div className="label">Offers</div>
          <div className="value" style={{ color: "var(--yellow)" }}>{offers}</div>
          <div className="sub">received</div>
        </div>
        <div className="stat-card">
          <div className="label">NeetCode</div>
          <div className="value" style={{ color: "var(--accent2)" }}>{mastered}/150</div>
          <div className="sub">problems mastered</div>
        </div>
      </div>

      <div className="grid-2 gap-16">
        {/* Opening Soon */}
        <div className="card">
          <div className="flex-between mb-16">
            <div className="section-label">🔥 Opening Soon</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setActive("career")}>View All</button>
          </div>
          {opening_soon.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 13 }}>All tracked companies open in 30+ days.</p>
          ) : (
            opening_soon.map((c) => {
              const u = getUrgencyLabel(c.days);
              return (
                <div key={c.id} className="flex-between" style={{ marginBottom: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{c.company}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>{c.tier}</span>
                  </div>
                  <span className={`mono ${u.cls}`} style={{ fontSize: 12 }}>{u.label}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Top Priority */}
        <div className="card">
          <div className="flex-between mb-16">
            <div className="section-label">⭐⭐⭐ Top Priority (Not Applied)</div>
          </div>
          {priority3.map((c) => (
            <div key={c.id} style={{ marginBottom: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <div className="flex-between">
                <span style={{ fontSize: 13, fontWeight: 600 }}>{c.company}</span>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{c.role}</span>
              </div>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{c.notes}</p>
            </div>
          ))}
          {priority3.length === 0 && <p style={{ color: "var(--green)", fontSize: 13 }}>✅ All top priority companies applied!</p>}
        </div>
      </div>

      {/* NeetCode Progress */}
      <div className="card mt-16">
        <div className="flex-between mb-16">
          <div className="section-label">💻 NeetCode 150 Progress</div>
          <button className="btn btn-ghost btn-sm" onClick={() => setActive("neetcode")}>Open</button>
        </div>
        {["Arrays & Hashing", "Two Pointers", "Sliding Window", "Stack", "Binary Search"].map((section) => {
          const total = neet.filter((p) => p.section === section).length;
          const done = neet.filter((p) => p.section === section && p.status === "mastered").length;
          const pct = total ? Math.round((done / total) * 100) : 0;
          return (
            <div key={section} style={{ marginBottom: 12 }}>
              <div className="flex-between" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 12 }}>{section}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{done}/{total}</span>
              </div>
              <div className="progress-wrap">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
