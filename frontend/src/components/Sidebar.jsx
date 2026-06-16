const NAV = [
  { id: "overview", icon: "⚡", label: "Overview" },
  { id: "career", icon: "🎯", label: "Career Tracker" },
  { id: "neetcode", icon: "💻", label: "NeetCode 150" },
  { id: "notes", icon: "📝", label: "Notes" },
  { id: "links", icon: "🔗", label: "Links" },
  { id: "mood", icon: "🌡️", label: "Mood Tracker" },
  { id: "reminders", icon: "🔔", label: "Reminders" },
];

export default function Sidebar({ active, setActive }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <h1>Cyril<span>HQ</span></h1>
        <p>Your command center</p>
      </div>
      {NAV.map((n) => (
        <div
          key={n.id}
          className={`nav-item ${active === n.id ? "active" : ""}`}
          onClick={() => setActive(n.id)}
        >
          <span className="nav-icon">{n.icon}</span>
          {n.label}
        </div>
      ))}
    </nav>
  );
}
