# CyrilHQ — Your Personal Command Center

> Built by [Cyril Annoh](https://www.linkedin.com/in/cyril-annoh/) · If you use this, tag me on LinkedIn for credit 🙏

This was created to help students with summer recruitment prep instead of having to do it all in an Excel spreadsheet.

A full-stack personal dashboard for CS students in internship recruiting season.
Built for my own Summer 2027 recruiting grind — feel free to fork and make it yours.

## Features
- 🎯 **Career Tracker** — 100 companies pre-loaded, track Applied/OA/Interview/Result, add new companies, opening date countdown
- 💻 **NeetCode 150 Tracker** — Track all 150 NeetCode problems, mark mastered/in progress, add pattern notes
- 📝 **Notes** — Capture DSA patterns, ideas, follow-ups by tag
- 🔗 **Links** — Save important career/DSA/project links
- 🌡️ **Mood Tracker** — Daily check-ins lol this just to check the vibe lol
- 🔔 **Reminders** — Send yourself  HTML email reminders, schedule future ones - this will help with companies alerts 
- 📧 **Auto Emails** — Daily NeetCode reminder (9am ET) + Weekly digest (Monday 8am ET)- This contains the companies you put and neetcode 150 track.

## What this isn't
This is a personal tool, not a SaaS product. There's no multi-user login, no real database (everything lives in your browser's localStorage), and email scheduling is in-memory (resets if the backend restarts). If you want something more robust, fork it and build on top — that's the whole point.

## No Java or Spring Boot experience?
Don't let that stop you. Use AI (Claude, ChatGPT, whatever you've got) to help you read through the code and get it running — the codebase is pretty straightforward and well-commented. And if you genuinely get stuck, feel free to message me directly. I'd rather help you fix it than have you give up on it.

**Good luck on your SWE search.**

---

## Personalize It First (Manual Steps)

Before running, update these to match your info:

**1. Your email** — search and replace `cyrrilann@gmail.com` with your own email across:
- `backend/src/main/java/com/dashboard/controller/ReminderController.java`
- `backend/src/main/java/com/dashboard/scheduler/WeeklyDigestScheduler.java`
- `frontend/src/components/Reminders.jsx`

**2. Your companies** — `frontend/src/data/companies.js` has 100 companies pre-loaded for a NYC CS student. Clear them out and add your own targets with links so its easier to search and click, or keep them as a starting point.

**3. Your NeetCode progress** — same file (`companies.js`), scroll to the `NEETCODE_150` export. It follows the official NeetCode 150 list with correct LeetCode problem numbers. Update each `status` field to reflect what you've already solved: `"not started"`, `"in progress"`, or `"mastered"`.

**4. Weekly email links** — `WeeklyDigestScheduler.java` has company links specific to my recruiting targets. Swap them for yours.

**5. Resend API key** — emails are sent via [Resend](https://resend.com) (free tier) instead of raw SMTP, because most hosts (Railway, Render, etc.) block outbound SMTP. Sign up with the email you want to send/receive from, grab an API key, and set it as `RESEND_API_KEY` in your environment.

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
export JAVA_HOME=/opt/homebrew/opt/openjdk@21
mvn spring-boot:run
\`\`\`
Runs on http://localhost:8080

### 3. Test it works
Visit http://localhost:8080/api/reminders/health → should return `{ "status": "CyrilHQ backend running ✅" }`

---

## Deploy to Vercel (Frontend)

\`\`\`bash
cd frontend
npm run build
\`\`\`
Push to GitHub → connect to Vercel → set **Root Directory** to `frontend` → deploy.

Set environment variable in Vercel (apply to all environments, including Production):
\`\`\`
VITE_BACKEND_URL=https://your-backend-url.com
\`\`\`

## Deploy Backend (Railway)

Push to GitHub → connect Railway → set **Root Directory** to `backend` → add environment variable:
\`\`\`
RESEND_API_KEY=re_your_key_here
\`\`\`
Railway auto-detects Maven and builds it. Note: Railway blocks outbound SMTP, which is exactly why this uses Resend's HTTP API instead of JavaMailSender.

---

## Data Persistence
All data (companies, notes, links, mood) is saved in **localStorage** — it persists across sessions in the same browser. No database required for the frontend.

Email scheduling uses an in-memory scheduler — scheduled reminders are lost if the backend restarts before they fire. Fine for a personal tool, not production-grade.

---

## License
This project is released under the **MIT License** — a standard open-source license that means: you're free to use, copy, modify, and distribute this code for any purpose, including commercially, with no restrictions. The only requirement is that the original copyright notice stays in the code somewhere. In plain terms: do whatever you want with it, no permission needed. A LinkedIn tag is appreciated but not required"Cyril Annoh". GOODLUCK ON BECOMING AN ENGINEER👨‍💻

*Built by Cyril Annoh · NYC College of Technology (CUNY) · CS Student · Bronx, NY*
*Questions or stuck on setup? Message me on [LinkedIn](https://www.linkedin.com/in/cyril-annoh/) — happy to help.*