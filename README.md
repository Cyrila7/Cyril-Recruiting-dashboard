# ⚡ CyrilHQ — Your Personal Recruiting Command Center

> Built by [Cyril Annoh](https://www.linkedin.com/in/cyril-annoh/) · If you use this, tag me on LinkedIn 🙏

A free, personal dashboard to help you survive internship/job recruiting season without living in
a messy spreadsheet. Track your applications, practice DSA problems, and get emailed the moment
a new job opens at companies you care about.

Built for my own Summer 2027 recruiting grind. Feel free to fork it and make it yours — you don't
need to be an experienced developer to get this running. Just follow the steps below.

---

## What This Actually Does

- 🎯 **Career Tracker** — Every company you're targeting, in one table. Track Applied → OA →
  Interview → Result, see how many days until applications open, star your top choices.
- 💻 **NeetCode 150 Tracker** — All 150 classic coding interview problems, organized by pattern,
  with progress bars so you can see exactly where you stand.
- 📝 **Notes** — Jot down interview prep notes, patterns you keep forgetting, follow-ups.
- 🔗 **Links** — Save useful career/prep/project links in one place.
- 🌡️ **Mood Tracker** — Quick daily check-ins during a stressful season.
- 🔔 **Email Reminders** — Send yourself reminders, or schedule future ones.
- 📧 **Daily/Weekly Digest** — Automatic email every morning with your DSA progress, and every
  Monday with a summary of what's coming up.
- 🚨 **New Job Alerts** — Checks your target companies' job boards every 15 minutes and emails you
  the second a new Software Engineer role goes live. Works fully on its own — the optional Adzuna
  integration just widens the search to catch companies you haven't added yourself.
  [See full setup →](docs/JOB_ALERTS.md)

---

## Screenshots

**Overview** — your daily snapshot: applied/interviews/offers, what's opening soon, top priority companies, and NeetCode progress at a glance.
![Overview](screenshots/overview.png)

**Career Tracker** — every company in one table, with status checkboxes, countdown to opening, priority stars, and editable notes.
![Career Tracker](screenshots/career-tracker.png)

**NeetCode 150 Tracker** — all 150 problems organized by section, with progress bars and per-problem pattern notes.
![NeetCode 150](screenshots/neetcode-tracker.png)

---

## What This Isn't

This is a personal tool, not a polished product. There's no login system, no multi-user support,
and most of your data (companies, notes, links, mood) lives in your own browser only — nothing
gets uploaded anywhere except for the job alert feature, which needs a small database
([details here](docs/JOB_ALERTS.md)).

If a company career link breaks over time, just search the company name + "careers."

---

## Incase You dont have any Java or springboot experience?

You do not need to know Java, React, or how any of this works under the hood to use this. Just
follow the steps below in order, and change a few things to match your own info.

If you get stuck, paste the error message into Claude, ChatGPT, or whichever AI assistant you
have and ask it to explain what's happening - that's a completely normal way to use this project.
Or message me on [LinkedIn](https://www.linkedin.com/in/cyril-annoh/).

---

## Step 1: Make It Yours

### Your email address
Search the project for `cyrrilann@gmail.com` and replace it with your own email in these three files:
- `backend/src/main/java/com/dashboard/controller/ReminderController.java`
- `backend/src/main/java/com/dashboard/scheduler/WeeklyDigestScheduler.java`
- `frontend/src/components/Reminders.jsx`

### Your companies (for the Career Tracker)
Open `frontend/src/data/companies.js`. There are 97 companies pre-loaded — these were my personal
targets. Keep them as a starting point, or delete them and add your own.

> ⚠️ **Important:** if you edit this file after you've already opened the app once in your
> browser, your changes won't show up automatically. To force a re-sync: open your browser's dev
> tools (`Cmd+Option+I` on Mac, `F12` on Windows), click **Console**, type `localStorage.clear()`,
> hit Enter, then refresh. This wipes everything stored locally, so save anything important first.

### Your NeetCode progress
In that same `companies.js` file, scroll to `NEETCODE_150` and update each problem's `status` to
`"not started"`, `"in progress"`, or `"mastered"` based on what you've actually solved.

---

## Step 2: Run It On Your Computer

### What you need installed
- [Node.js](https://nodejs.org) (18+)
- [Java 21](https://adoptium.net)
- [Maven](https://maven.apache.org/download.cgi)

Check with `node -v`, `java -version`, `mvn -v` in your terminal.

### Start the frontend
```bash
cd frontend
npm install
npm run dev
```
Opens at **http://localhost:5173**

### Start the backend
Emails are sent through [Resend](https://resend.com), a free service, because most hosting
platforms block traditional email-sending methods.

1. Sign up at resend.com using the email you want alerts sent to
2. Copy your API key from the dashboard
3. Set it as an environment variable:
```bash
   export RESEND_API_KEY=re_your_key_here
```
4. Start the backend:
```bash
   cd backend
   mvn spring-boot:run
```
   Runs at **http://localhost:8080**

> **Mac users:** if this fails, try `export JAVA_HOME=/opt/homebrew/opt/openjdk@21` first.

### Confirm it's working
Visit **http://localhost:8080/api/reminders/health** — you should see:
```json
{ "status": "CyrilHQ backend running ✅" }
```

---

## Step 3: Put It Online

### Frontend → Vercel
```bash
cd frontend
npm run build
```
Push to GitHub, connect to [Vercel](https://vercel.com), set **Root Directory** to `frontend`,
and add environment variable `VITE_BACKEND_URL` = your Railway backend URL.

### Backend → Railway
Connect your GitHub repo to [Railway](https://railway.app), set **Root Directory** to `backend`,
add `RESEND_API_KEY`. Railway auto-detects and builds the Java project.

---

## Step 4: Job Alerts (Optional)

Want to get emailed instantly when a new job opens? This needs a small free database. Adzuna (a
free API that widens the search beyond your company list) is a nice-to-have on top, not required
— the core alerts work great without it. **[Full setup guide →](docs/JOB_ALERTS.md)**

---

## How Your Data Is Stored

- **Companies, notes, links, mood** — saved in your browser only, nothing uploaded.
- **Job alert history** — stored in a small database (see Job Alerts guide), just job titles/IDs,
  no personal info.
- **Scheduled reminders** — in-memory, lost if the backend restarts. Fine for personal use.

---

## Something Broke?

- **Job alerts stopped** — check [Resend's dashboard](https://resend.com) for your daily email limit.
- **App won't start locally** — confirm Node 18+, Java 21, Maven are installed, and you ran
  `npm install` in `frontend` first.
- **Career Tracker changes aren't showing** — see the `localStorage.clear()` note in Step 1.
- **Still stuck?** Ask an AI assistant, or reach out on [LinkedIn](https://www.linkedin.com/in/cyril-annoh/).

---

## License

MIT License — free to use, copy, modify, and share for any purpose. Keep the original copyright
notice somewhere in the code. A LinkedIn tag is appreciated but never required.

---

*Built by Cyril Annoh · NYC College of Technology (CUNY) · CS Student · Bronx, NY*