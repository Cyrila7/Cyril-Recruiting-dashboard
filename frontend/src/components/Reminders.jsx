import { useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const QUICK_REMINDERS = [
  {
    label: "Daily NeetCode reminder",
    subject: "🧠 Daily NeetCode Reminder",
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;background:#0a0a0f;padding:24px;border-radius:12px;">
        <h2 style="color:#6c63ff;margin:0 0 16px;">🧠 Time to grind DSA</h2>
        <div style="background:#1a1a24;border-radius:8px;padding:16px;margin-bottom:16px;">
          <p style="color:#43d9ad;font-weight:700;margin:0 0 10px;font-size:13px;">5-Step Framework</p>
          <p style="color:#e8e8f0;font-size:13px;line-height:1.8;margin:0;">
            1️⃣ Return type → 2️⃣ Initializations → 3️⃣ Loop type → 4️⃣ Logic → 5️⃣ Return
          </p>
        </div>
        <p style="color:#e8e8f0;font-size:13px;margin:0 0 16px;">Current section: <strong style="color:#ffa502;">Two Pointers</strong></p>
        <div style="margin-bottom:8px;"><a href="https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" style="display:block;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;padding:10px 16px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">Two Sum II (#167) — IN PROGRESS <span style="color:#6c63ff;">→</span></a></div>
        <div style="margin-bottom:8px;"><a href="https://leetcode.com/problems/3sum/" style="display:block;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;padding:10px 16px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">3Sum (#15) <span style="color:#6c63ff;">→</span></a></div>
        <div style="margin-bottom:16px;"><a href="https://neetcode.io/roadmap" style="display:block;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;padding:10px 16px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">NeetCode Roadmap <span style="color:#6c63ff;">→</span></a></div>
        <div style="background:#ff658422;border:1px solid #ff658444;border-radius:8px;padding:14px;text-align:center;">
          <p style="margin:0;color:#ff9fb4;font-size:13px;">🔥 Two hours today. Keep going.</p>
        </div>
      </div>`
  },
  {
    label: "Check applications opening",
    subject: "📋 Applications Opening Soon",
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;background:#0a0a0f;padding:24px;border-radius:12px;">
        <h2 style="color:#6c63ff;margin:0 0 16px;">📋 Opening This Month — Apply Early</h2>
        <div style="background:#1a1a24;border-radius:8px;padding:16px;margin-bottom:16px;">
          <p style="color:#ff4757;font-size:11px;font-weight:700;margin:0 0 10px;text-transform:uppercase;letter-spacing:1px;">🔴 July 2026 — Apply Day 1</p>
          <div style="margin-bottom:8px;"><a href="https://amazon.jobs/content/en/teams/internships-for-students" style="display:block;background:#0a0a0f;border:1px solid #2a2a3a;border-radius:6px;padding:9px 14px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">Amazon SDE Intern <span style="color:#6c63ff;">→</span></a></div>
          <div style="margin-bottom:8px;"><a href="https://databricks.com/company/careers/university-recruiting" style="display:block;background:#0a0a0f;border:1px solid #2a2a3a;border-radius:6px;padding:9px 14px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">Databricks SWE Intern <span style="color:#6c63ff;">→</span></a></div>
          <div style="margin-bottom:8px;"><a href="https://bloomberg.com/company/careers/working-here/engineering" style="display:block;background:#0a0a0f;border:1px solid #2a2a3a;border-radius:6px;padding:9px 14px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">Bloomberg SWE Intern <span style="color:#6c63ff;">→</span></a></div>
          <div style="margin-bottom:8px;"><a href="https://capitalonecareers.com/tech/university-programs" style="display:block;background:#0a0a0f;border:1px solid #2a2a3a;border-radius:6px;padding:9px 14px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">Capital One SWE Intern <span style="color:#6c63ff;">→</span></a></div>
          <div><a href="https://careers.jpmorgan.com/us/en/students/programs" style="display:block;background:#0a0a0f;border:1px solid #2a2a3a;border-radius:6px;padding:9px 14px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">JPMorgan Chase SWE Intern <span style="color:#6c63ff;">→</span></a></div>
        </div>
        <div style="background:#1a1a24;border-radius:8px;padding:16px;margin-bottom:16px;">
          <p style="color:#ffa502;font-size:11px;font-weight:700;margin:0 0 10px;text-transform:uppercase;letter-spacing:1px;">🟡 August 2026</p>
          <div style="margin-bottom:8px;"><a href="https://careers.microsoft.com/students/us/en/usuniversityinternship" style="display:block;background:#0a0a0f;border:1px solid #2a2a3a;border-radius:6px;padding:9px 14px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">Microsoft SWE Intern <span style="color:#6c63ff;">→</span></a></div>
          <div style="margin-bottom:8px;"><a href="https://careers.datadoghq.com/early-careers" style="display:block;background:#0a0a0f;border:1px solid #2a2a3a;border-radius:6px;padding:9px 14px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">Datadog SWE Intern <span style="color:#6c63ff;">→</span></a></div>
          <div><a href="https://ramp.com/emerging-talent" style="display:block;background:#0a0a0f;border:1px solid #2a2a3a;border-radius:6px;padding:9px 14px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">Ramp SWE Intern <span style="color:#6c63ff;">→</span></a></div>
        </div>
        <a href="https://github.com/SimplifyJobs/Summer2027-Internships" style="display:block;background:#6c63ff;color:#fff;text-decoration:none;padding:12px;border-radius:8px;text-align:center;font-size:13px;font-weight:700;">View All Openings on SimplifyJobs →</a>
      </div>`
  },
  {
    label: "Weekly digest",
    subject: "📊 Weekly Career Check-in",
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;background:#0a0a0f;padding:24px;border-radius:12px;">
        <h2 style="color:#6c63ff;margin:0 0 16px;">📊 Weekly Check-in</h2>
        <div style="background:#1a1a24;border-radius:8px;padding:16px;margin-bottom:16px;">
          <p style="color:#43d9ad;font-weight:700;font-size:13px;margin:0 0 10px;">✅ This Week's Checklist</p>
          <p style="color:#e8e8f0;font-size:13px;line-height:2;margin:0;">
            □ Check SimplifyJobs for new openings<br>
            □ Apply to any companies that just opened<br>
            □ Do 5+ NeetCode problems<br>
            □ Follow up on pending applications (2+ weeks old)<br>
            □ Update your CyrilHQ tracker
          </p>
        </div>
        <div style="margin-bottom:8px;"><a href="https://github.com/SimplifyJobs/Summer2027-Internships" style="display:block;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;padding:10px 16px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">SimplifyJobs Summer 2027 Tracker <span style="color:#6c63ff;">→</span></a></div>
        <div style="margin-bottom:8px;"><a href="https://neetcode.io/roadmap" style="display:block;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;padding:10px 16px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">NeetCode Roadmap <span style="color:#6c63ff;">→</span></a></div>
        <div style="margin-bottom:8px;"><a href="https://path-pilot-rho.vercel.app" style="display:block;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;padding:10px 16px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">PathPilot (Your Live Product) <span style="color:#6c63ff;">→</span></a></div>
        <div style="margin-bottom:16px;"><a href="https://cunystartups.com/accelerator" style="display:block;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;padding:10px 16px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">CUNYStartups — NVA 2 opens Fall 2026 <span style="color:#6c63ff;">→</span></a></div>
        <div style="background:#6c63ff22;border:1px solid #6c63ff44;border-radius:8px;padding:14px;">
          <p style="margin:0;color:#a09cf7;font-size:13px;line-height:1.7;">💡 Apply broadly. Whichever company gives you the first real opportunity gets a serious look. Your first internship isn't your last.</p>
        </div>
      </div>`
  },
  {
    label: "Follow up reminder",
    subject: "📧 Time to Follow Up",
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;background:#0a0a0f;padding:24px;border-radius:12px;">
        <h2 style="color:#6c63ff;margin:0 0 16px;">📧 Follow Up — Don't Let Leads Go Cold</h2>
        <div style="background:#1a1a24;border-radius:8px;padding:16px;margin-bottom:16px;">
          <p style="color:#ffa502;font-weight:700;font-size:13px;margin:0 0 10px;">🔥 Warm Leads — Follow Up Now</p>
          <div style="margin-bottom:8px;padding:10px;background:#0a0a0f;border-radius:6px;">
            <p style="margin:0;color:#e8e8f0;font-size:13px;font-weight:600;">Foresight Industries</p>
            <p style="margin:4px 0 0;color:#6b6b80;font-size:11px;">Contact: JJ · Career Launch top pick</p>
          </div>
          <div style="margin-bottom:8px;padding:10px;background:#0a0a0f;border-radius:6px;">
            <p style="margin:0;color:#e8e8f0;font-size:13px;font-weight:600;">Unadat</p>
            <p style="margin:4px 0 0;color:#6b6b80;font-size:11px;">Contact: Dan Pesman (CTO) · Requested high mutual ranking</p>
          </div>
          <div style="padding:10px;background:#0a0a0f;border-radius:6px;">
            <p style="margin:0;color:#e8e8f0;font-size:13px;font-weight:600;">doobneek Inc</p>
            <p style="margin:4px 0 0;color:#6b6b80;font-size:11px;">Contact: Ivan Dudnik (Founder) · Interview went well</p>
          </div>
        </div>
        <div style="background:#1a1a24;border-radius:8px;padding:16px;margin-bottom:16px;">
          <p style="color:#43d9ad;font-weight:700;font-size:13px;margin:0 0 10px;">📝 Follow-up Template</p>
          <p style="color:#6b6b80;font-size:12px;line-height:1.7;margin:0;font-style:italic;">
            "Hi [Name], I wanted to follow up on my application for the software engineering internship. I remain very interested in [Company] and would love to discuss how my experience with Java, Spring Boot, and PathPilot could be a fit for your team. Please let me know if there's anything else I can provide."
          </p>
        </div>
        <a href="http://localhost:5173" style="display:block;background:#6c63ff;color:#fff;text-decoration:none;padding:12px;border-radius:8px;text-align:center;font-size:13px;font-weight:700;">Open Tracker to Update Statuses →</a>
      </div>`
  },
  {
    label: "PathPilot build reminder",
    subject: "🚀 Ship Something on PathPilot Today",
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;background:#0a0a0f;padding:24px;border-radius:12px;">
        <h2 style="color:#6c63ff;margin:0 0 16px;">🚀 PathPilot Build Reminder</h2>
        <div style="background:#1a1a24;border-radius:8px;padding:16px;margin-bottom:16px;">
          <p style="color:#43d9ad;font-weight:700;font-size:13px;margin:0 0 10px;">V2 Remaining TODOs</p>
          <p style="color:#e8e8f0;font-size:13px;line-height:2;margin:0;">
            □ RegisterPage UI<br>
            □ Register → Onboarding flow<br>
            □ Weekly check-in feature<br>
            □ SSE streaming improvements<br>
            □ Score ring dashboard polish
          </p>
        </div>
        <div style="background:#1a1a24;border-radius:8px;padding:16px;margin-bottom:16px;">
          <p style="color:#ff6584;font-weight:700;font-size:13px;margin:0 0 10px;">💡 PathPilot V3 Vision</p>
          <p style="color:#6b6b80;font-size:13px;line-height:1.7;margin:0;">
            Application intelligence + peer networks. Not just AI advice — honest company recommendations ranked by realistic hire rate from your school and stack, paired with warm connections to students who already got in.
          </p>
        </div>
        <div style="margin-bottom:8px;"><a href="https://path-pilot-rho.vercel.app" style="display:block;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;padding:10px 16px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">PathPilot Live App <span style="color:#6c63ff;">→</span></a></div>
        <div style="margin-bottom:16px;"><a href="https://github.com/Cyrila7/PathPilot" style="display:block;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;padding:10px 16px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;">PathPilot GitHub <span style="color:#6c63ff;">→</span></a></div>
        <div style="background:#ff658422;border:1px solid #ff658444;border-radius:8px;padding:14px;text-align:center;">
          <p style="margin:0;color:#ff9fb4;font-size:13px;">Ship something today. Even small. Momentum is everything.</p>
        </div>
      </div>`
  },
];

export default function Reminders() {
  const [reminders, setReminders] = useState(() => JSON.parse(localStorage.getItem("reminders") || "[]"));
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [sending, setSending] = useState(null);
  const [feedback, setFeedback] = useState("");

  const saveLocal = (u) => { setReminders(u); localStorage.setItem("reminders", JSON.stringify(u)); };

  const sendHtml = async (r) => {
    setSending(r.label);
    setFeedback("");
    try {
      const res = await fetch(`${BACKEND}/api/reminders/send-html`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: r.subject, html: r.html, to: "cyrrilann@gmail.com" }),
      });
      if (res.ok) {
        setFeedback("✅ Email sent to cyrrilann@gmail.com!");
        saveLocal([{ id: Date.now(), title: r.label, sentAt: new Date().toLocaleString() }, ...reminders]);
      } else {
        setFeedback("❌ Failed to send. Check backend logs.");
      }
    } catch {
      setFeedback("❌ Could not connect to backend on port 8080.");
    }
    setSending(null);
  };

  const sendCustom = async () => {
    if (!title || !message) return alert("Fill in subject and message");
    setSending("custom");
    try {
      const res = await fetch(`${BACKEND}/api/reminders/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: title, message, to: "cyrrilann@gmail.com" }),
      });
      if (res.ok) {
        setFeedback("✅ Custom reminder sent!");
        setTitle(""); setMessage(""); setScheduledTime("");
        saveLocal([{ id: Date.now(), title, sentAt: new Date().toLocaleString() }, ...reminders]);
      } else setFeedback("❌ Failed to send.");
    } catch { setFeedback("❌ Could not connect to backend."); }
    setSending(null);
  };

  const scheduleReminder = async () => {
    if (!title || !message || !scheduledTime) return alert("Fill in all fields");
    setSending("schedule");
    try {
      const res = await fetch(`${BACKEND}/api/reminders/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: title, message, to: "cyrrilann@gmail.com", scheduledTime }),
      });
      const data = await res.json();
      alert("SENT scheduledTime: " + scheduledTime + "\n\nRESPONSE: " + JSON.stringify(data));
      if (res.ok) {
        setFeedback(`✅ Scheduled for ${new Date(scheduledTime).toLocaleString()}`);
        setTitle(""); setMessage(""); setScheduledTime("");
      } else setFeedback("❌ Failed to schedule: " + JSON.stringify(data));
    } catch (err) { setFeedback("❌ Could not connect to backend: " + err.message); }
    setSending(null);
  };

  return (
    <div>
      <div className="page-header">
        <h2>🔔 Reminders</h2>
        <p>Rich email reminders sent to cyrrilann@gmail.com · Auto: Daily 9am + Weekly Monday 8am</p>
      </div>

      {feedback && (
        <div className={`alert ${feedback.includes("✅") ? "alert-green" : "alert-red"}`}>{feedback}</div>
      )}

      <div className="grid-2 gap-16">
        {/* Quick send */}
        <div className="card">
          <div className="section-label mb-16">⚡ Quick Send</div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Sends a rich email with links and context — not just plain text.</p>
          {QUICK_REMINDERS.map((r) => (
            <div key={r.label} className="flex-between" style={{ marginBottom: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</span>
                <p style={{ fontSize: 11, color: "var(--muted)", margin: "2px 0 0" }}>Includes relevant links</p>
              </div>
              <button
                className="btn btn-primary btn-sm"
                disabled={sending !== null}
                onClick={() => sendHtml(r)}
                style={{ opacity: sending && sending !== r.label ? 0.5 : 1 }}
              >
                {sending === r.label ? "Sending..." : "Send"}
              </button>
            </div>
          ))}
        </div>

        {/* Custom */}
        <div className="card">
          <div className="section-label mb-16">✏️ Custom Reminder</div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Subject</label>
            <input className="input" placeholder="Reminder subject..." value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Message</label>
            <textarea className="textarea" placeholder="What do you need to remember?" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Schedule (optional)</label>
            <input className="input" type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
          </div>
          <div className="flex gap-8">
            <button className="btn btn-primary" disabled={sending !== null} onClick={sendCustom}>Send Now</button>
            <button className="btn btn-ghost" disabled={sending !== null || !scheduledTime} onClick={scheduleReminder}>Schedule</button>
          </div>
        </div>
      </div>

      {/* Auto email info */}
      <div className="card mt-24">
        <div className="section-label mb-16">🤖 Automatic Emails (Backend Running)</div>
        <div className="grid-2 gap-16">
          <div className="card-sm">
            <div className="flex-center gap-8 mb-8">
              <span className="dot dot-green"></span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Daily NeetCode Reminder</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>Fires every day at 9:00 AM — includes your 5-step framework, current section problems with LeetCode links, and progress bars.</p>
          </div>
          <div className="card-sm">
            <div className="flex-center gap-8 mb-8">
              <span className="dot dot-green"></span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Weekly Recruiting Digest</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>Fires every Monday at 8:00 AM — includes companies opening that week with direct career page links, priority companies, and weekly strategy tip.</p>
          </div>
        </div>
      </div>

      {/* History */}
      {reminders.length > 0 && (
        <div className="card mt-16">
          <div className="section-label mb-16">Sent History</div>
          {reminders.slice(0, 10).map((r) => (
            <div key={r.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
              <div className="flex-between">
                <span style={{ fontWeight: 600 }}>{r.title}</span>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{r.sentAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}