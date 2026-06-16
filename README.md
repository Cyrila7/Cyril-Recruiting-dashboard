# CyrilHQ — Your Personal Command Center

A full-stack dashboard built for Cyril's internship recruiting season.

## Features
- 🎯 **Career Tracker** — 100 companies pre-loaded, track Applied/OA/Interview/Result, add new companies, opening date countdown
- 💻 **NeetCode 150** — Track all 150 problems, mark mastered/in progress, add pattern notes
- 📝 **Notes** — Capture DSA patterns, ideas, follow-ups by tag
- 🔗 **Links** — Save important career/DSA/project links
- 🌡️ **Mood Tracker** — Daily check-ins
- 🔔 **Reminders** — Send yourself email reminders, schedule future ones
- 📧 **Auto Emails** — Daily NeetCode reminder (9am) + Weekly digest (Monday 8am)

---

## Setup

### Prerequisites
- Node.js 18+
- Java 21
- Maven

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```
Opens at http://localhost:5173

### 2. Backend (Email)

**First — get a Gmail App Password:**
1. Go to myaccount.google.com
2. Security → 2-Step Verification → App Passwords
3. Generate password for "Mail" → "Other device" → name it "CyrilHQ"
4. Copy the 16-character password

**Then update the config:**
```
backend/src/main/resources/application.properties
```
Replace `YOUR_GMAIL_APP_PASSWORD` with your actual app password.

**Run the backend:**
```bash
cd backend
export JAVA_HOME=/opt/homebrew/opt/openjdk@21
mvn spring-boot:run
```
Runs on http://localhost:8080

### 3. Test it works
Visit http://localhost:8080/api/reminders/health → should return `{ "status": "CyrilHQ backend running ✅" }`

---

## Deploy to Vercel (Frontend)

```bash
cd frontend
npm run build
```
Push to GitHub → connect to Vercel → deploy.

Set environment variable in Vercel:
```
VITE_BACKEND_URL=https://your-backend-url.com
```

## Deploy Backend (Railway)
Same pattern as PathPilot — push to GitHub, connect Railway, set env vars for mail config.

---

## Data Persistence
All data (companies, notes, links, mood) is saved in **localStorage** — it persists across sessions in the same browser. No database needed for the frontend.

Email scheduling uses an in-memory scheduler — scheduled reminders reset if the backend restarts. For production, swap to a database-backed scheduler.
