# CyrilHQ — Your Personal Command Center

> Built by [Cyril Annoh](https://www.linkedin.com/in/cyril-annoh/) · If you use this, tag me on LinkedIn for credit 🙏

This was created to help students with summer recruitment prep instead of having to do it all in an Excel spreadsheet.

A full-stack personal dashboard for CS students in internship recruiting season.
Built for my own Summer 2027 recruiting grind — feel free to fork and make it yours.

## Features
- 🎯 **Career Tracker** — 97 companies pre-loaded, track Applied/OA/Interview/Result, add new companies, opening date countdown
- 💻 **NeetCode 150 Tracker** — Track all 150 NeetCode problems, mark mastered/in progress, add pattern notes
- 📝 **Notes** — Capture DSA patterns, ideas, follow-ups by tag
- 🔗 **Links** — Save important career/DSA/project links
- 🌡️ **Mood Tracker** — Daily check-ins
- 🔔 **Reminders** — Send yourself HTML email reminders, schedule future ones
- 📧 **Auto Emails** — Daily NeetCode reminder (9am ET) + Weekly digest (Monday 8am ET)

## Screenshots

**Overview** — your daily snapshot: applied/interviews/offers, what's opening soon, top priority companies, and NeetCode progress at a glance.
![Overview](screenshots/overview.png)

**Career Tracker** — every company in one table, with status checkboxes, countdown to opening, priority stars, and editable notes.
![Career Tracker](screenshots/career-tracker.png)

**NeetCode 150 Tracker** — all 150 problems organized by section, with progress bars and per-problem pattern notes.
![NeetCode 150](screenshots/neetcode-tracker.png)

## What this isn't
This is a personal tool, not a SaaS product. There's no multi-user login, no real database, and email scheduling is in-memory and resets if the backend restarts. If you want something more robust, fork it and build on top.

Company career page links may change over time. If one breaks, search the company name + "careers" or go straight to their main careers page.

## How Data Works
**`companies.js` is seed data, not a live source.** The first time the app loads, it copies everything into your browser's localStorage. After that, the app reads and writes from localStorage only.

Key things to know:
- Editing `companies.js` and pushing it won't update your own browser until you clear localStorage and reload.
- Adding or editing a company through the UI only saves to your local browser session, not back to the source file.
- Email reminders do include UI-added companies since the backend reads live data, not the static file.

**To force a re-sync after editing `companies.js`:** open DevTools (Cmd+Option+I on Mac, F12 on Windows), go to the Console tab, run `localStorage.clear()`, then refresh. This wipes all locally stored data including notes, links, and application status, so write anything important down first.

## No Java or Spring Boot experience?
Don't let that stop you. Use AI (Claude, ChatGPT, whatever you've got) to help read through the code and get it running. The codebase is straightforward and well-commented. If you genuinely get stuck, message me on [LinkedIn](https://www.linkedin.com/in/cyril-annoh/) and I'll help.

**Good luck on your SWE search.**

---

## Personalize It First

Before running, update these to match your info:

**1. Your email (most important)** — search and replace `cyrrilann@gmail.com` with your own email across:
- `backend/src/main/java/com/dashboard/controller/ReminderController.java`
- `backend/src/main/java/com/dashboard/scheduler/WeeklyDigestScheduler.java`
- `frontend/src/components/Reminders.jsx`

**2. Your companies** — `frontend/src/data/companies.js` has 97 companies pre-loaded for a NYC CS student. Keep them as a starting point or clear them out and add your own. See "How Data Works" above if your browser doesn't reflect changes after editing this file.

**3. Your NeetCode progress** — in the same `companies.js` file, scroll to the `NEETCODE_150` export and update each `status` field to reflect what you've already solved: `"not started"`, `"in progress"`, or `"mastered"`.

**4. Weekly email links** — `WeeklyDigestScheduler.java` has company links specific to my targets. Swap them for yours.

**5. Resend API key** — emails go through [Resend](https://resend.com) (free tier) instead of raw SMTP, because most hosts block outbound SMTP. Sign up with the email you want to send from, grab an API key, and set it as `RESEND_API_KEY` in your environment.

---

## Setup

### Prerequisites
- Node.js 18+
- Java 21
- Maven

### 1. Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
Opens at http://localhost:5173

### 2. Backend (Email via Resend)

1. Sign up at [resend.com](https://resend.com) using the email you want reminders sent from/to
2. Grab your API key from the dashboard
3. Set it as an environment variable:
\`\`\`bash
export RESEND_API_KEY=re_your_key_here
\`\`\`

**Run the backend:**
\`\`\`bash
cd backend
mvn spring-boot:run
\`\`\`
Runs on http://localhost:8080

> **Note:** On Mac with Homebrew, you may need to run `export JAVA_HOME=/opt/homebrew/opt/openjdk@21` first. On Windows/Linux, just make sure Java 21 is on your PATH.

### 3. Test it works
Visit http://localhost:8080/api/reminders/health and you should get `{ "status": "CyrilHQ backend running ✅" }`

---

## Deploy to Vercel (Frontend)

\`\`\`bash
cd frontend
npm run build
\`\`\`
Push to GitHub, connect to Vercel, set **Root Directory** to `frontend`, and deploy.

Add this environment variable in Vercel (apply to all environments including Production):
\`\`\`
VITE_BACKEND_URL=https://your-backend-url.com
\`\`\`

## Deploy Backend (Railway)

Push to GitHub, connect Railway, set **Root Directory** to `backend`, and add:
\`\`\`
RESEND_API_KEY=re_your_key_here
\`\`\`
Railway auto-detects Maven and builds it. Railway blocks outbound SMTP, which is why this uses Resend's HTTP API instead of JavaMailSender.

---

## Data Persistence
All data (companies, notes, links, mood) is saved in localStorage and persists across sessions in the same browser. No database required for the frontend. See "How Data Works" above for details.

Email scheduling is in-memory. Scheduled reminders are lost if the backend restarts before they fire. Fine for a personal tool, not production-grade.

---

## License
MIT License. You're free to use, copy, modify, and distribute this code for any purpose with no restrictions. The only requirement is that the original copyright notice stays in the code somewhere. A LinkedIn tag is appreciated but not required.

*Built by Cyril Annoh · NYC College of Technology (CUNY) · CS Student · Bronx, NY*