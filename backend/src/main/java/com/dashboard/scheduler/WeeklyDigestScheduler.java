package com.dashboard.scheduler;

import com.dashboard.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class WeeklyDigestScheduler {

    @Autowired
    private EmailService emailService;

    // Every Monday at 8:00 AM
    @Scheduled(cron = "0 0 8 * * MON")
    public void sendWeeklyDigest() {
        String html = EmailService.baseTemplate(weeklyContent(), "Weekly Recruiting Digest 📊");
        emailService.sendHtmlEmail("cyrrilann@gmail.com", "Weekly Recruiting Digest 📊", html);
        System.out.println("Weekly digest sent.");
    }

    // Daily NeetCode reminder at 9:00 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void sendDailyNeetCode() {
        String html = EmailService.baseTemplate(neetcodeContent(), "Daily DSA Reminder 🧠");
        emailService.sendHtmlEmail("cyrrilann@gmail.com", "🧠 Daily NeetCode Reminder", html);
        System.out.println("Daily NeetCode reminder sent.");
    }

    private String weeklyContent() {
        return section("📅 Companies Opening This Month", openingSoonLinks()) +
               section("⭐ Top Priority Companies", priorityLinks()) +
               section("🔗 Quick Links", quickLinks()) +
               section("💡 This Week's Strategy", strategyTip());
    }

    private String neetcodeContent() {
        return section("🧠 Your DSA Framework", framework()) +
               section("📍 Current Progress", progress()) +
               section("🔗 Problem Links — Two Pointers (In Progress)", twoPointerLinks()) +
               section("📚 Resources", dsaLinks()) +
               motivationBox();
    }

    private String section(String title, String content) {
        return "<div style='margin-bottom:24px;'>" +
               "<h2 style='margin:0 0 12px;color:#e8e8f0;font-size:15px;font-weight:700;border-bottom:1px solid #2a2a3a;padding-bottom:8px;'>" + title + "</h2>" +
               content +
               "</div>";
    }

    private String linkBtn(String label, String url, String sublabel) {
        return "<div style='margin-bottom:10px;'>" +
               "<a href='" + url + "' style='display:inline-block;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;padding:10px 16px;text-decoration:none;color:#e8e8f0;font-size:13px;font-weight:600;'>" +
               label + " <span style='color:#6c63ff;'>→</span></a>" +
               (sublabel != null && !sublabel.isEmpty() ? "<p style='margin:4px 0 0 4px;color:#6b6b80;font-size:11px;'>" + sublabel + "</p>" : "") +
               "</div>";
    }

    private String badge(String text, String color) {
        return "<span style='display:inline-block;background:" + color + "22;color:" + color + ";padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;margin-right:6px;'>" + text + "</span>";
    }

    private String openingSoonLinks() {
        return "<div style='background:#1a1a24;border-radius:8px;padding:16px;'>" +
               row("Amazon SDE Intern", "July 2026", "#ff4757", "amazon.jobs/content/en/teams/internships-for-students") +
               row("Databricks SWE Intern", "July 2026", "#ff4757", "databricks.com/company/careers/university-recruiting") +
               row("Bloomberg SWE Intern", "July 2026", "#ff4757", "bloomberg.com/company/careers/working-here/engineering") +
               row("Capital One SWE Intern", "July 2026", "#ff4757", "capitalonecareers.com/tech/university-programs") +
               row("JPMorgan Chase SWE Intern", "July 2026", "#ff4757", "careers.jpmorgan.com/us/en/students/programs") +
               row("Microsoft SWE Intern", "Aug 2026", "#ffa502", "careers.microsoft.com/students/us/en/usuniversityinternship") +
               row("Google SWE Intern", "Aug 2026", "#ffa502", "careers.google.com/jobs/results/?category=ENGINEERING") +
               row("Datadog SWE Intern", "Aug 2026", "#ffa502", "careers.datadoghq.com/early-careers") +
               row("MongoDB SWE Intern", "Aug 2026", "#ffa502", "mongodb.com/careers/departments/university-recruiting") +
               row("Ramp SWE Intern", "Aug 2026", "#ffa502", "ramp.com/emerging-talent") +
               "</div>";
    }

    private String row(String company, String opens, String color, String url) {
        return "<div style='display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #2a2a3a;'>" +
               "<a href='https://" + url + "' style='color:#e8e8f0;text-decoration:none;font-size:13px;font-weight:600;'>" + company + "</a>" +
               "<span style='color:" + color + ";font-size:11px;font-weight:700;font-family:monospace;'>" + opens + "</span>" +
               "</div>";
    }

    private String priorityLinks() {
        return linkBtn("Bloomberg Careers", "https://bloomberg.com/company/careers/working-here/engineering", "NYC HQ · Java-heavy · Actively recruits CUNY") +
               linkBtn("Capital One Tech", "https://capitalonecareers.com/tech/university-programs", "Great diversity programs · Java-heavy") +
               linkBtn("JPMorgan Chase", "https://careers.jpmorgan.com/us/en/students/programs", "NYC-based · Massive Java shop") +
               linkBtn("Datadog Early Careers", "https://careers.datadoghq.com/early-careers", "NYC HQ · Java/backend heavy") +
               linkBtn("MongoDB University", "https://mongodb.com/careers/departments/university-recruiting", "NYC HQ · Database company · Perfect Java fit") +
               linkBtn("Cockroach Labs", "https://cockroachlabs.com/careers/internships", "NYC · Production code from day 1");
    }

    private String quickLinks() {
        return linkBtn("SimplifyJobs Summer 2027 Tracker", "https://github.com/SimplifyJobs/Summer2027-Internships", "Updated daily — check every Monday") +
               linkBtn("NeetCode Roadmap", "https://neetcode.io/roadmap", "Your DSA bible") +
               linkBtn("LeetCode", "https://leetcode.com", "Grind time") +
               linkBtn("PathPilot (Live)", "https://path-pilot-rho.vercel.app", "Your deployed product") +
               linkBtn("CUNYStartups", "https://cunystartups.com/accelerator", "NVA 2 opens Fall 2026");
    }

    private String strategyTip() {
        return "<div style='background:#6c63ff22;border:1px solid #6c63ff44;border-radius:8px;padding:16px;'>" +
               "<p style='margin:0;color:#a09cf7;font-size:13px;line-height:1.7;'>" +
               "💡 <strong>This week:</strong> Amazon opens in July — that's weeks away. " +
               "Polish your resume now, add your Career Launch internship the day placement is confirmed. " +
               "Apply to Amazon on day 1 — it fills fast. " +
               "Every week you don't apply is a week someone else takes your spot." +
               "</p></div>";
    }

    private String framework() {
        return "<div style='background:#1a1a24;border-radius:8px;padding:16px;'>" +
               "<p style='margin:0 0 8px;color:#43d9ad;font-size:13px;font-weight:700;'>5-Step Framework</p>" +
               step("1", "Return type — what does the function return?") +
               step("2", "Initializations — what variables/structures do I need?") +
               step("3", "Loop type — for loop, while loop, two pointer?") +
               step("4", "Logic — what happens inside the loop?") +
               step("5", "Return — what do I return at the end?") +
               "</div>";
    }

    private String step(String num, String text) {
        return "<div style='display:flex;gap:10px;margin-bottom:8px;align-items:flex-start;'>" +
               "<span style='background:#6c63ff;color:#fff;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;line-height:20px;text-align:center;'>" + num + "</span>" +
               "<span style='color:#e8e8f0;font-size:13px;line-height:1.5;'>" + text + "</span>" +
               "</div>";
    }

    private String progress() {
        return "<div style='background:#1a1a24;border-radius:8px;padding:16px;'>" +
               progressRow("Arrays & Hashing", 9, 9, "#2ed573") +
               progressRow("Two Pointers", 5, 1, "#ffa502") +
               progressRow("Sliding Window", 6, 0, "#6b6b80") +
               progressRow("Stack", 7, 0, "#6b6b80") +
               progressRow("Binary Search", 7, 0, "#6b6b80") +
               "</div>";
    }

    private String progressRow(String section, int total, int done, String color) {
        int pct = total > 0 ? (done * 100 / total) : 0;
        return "<div style='margin-bottom:12px;'>" +
               "<div style='display:flex;justify-content:space-between;margin-bottom:4px;'>" +
               "<span style='color:#e8e8f0;font-size:12px;'>" + section + "</span>" +
               "<span style='color:#6b6b80;font-size:11px;font-family:monospace;'>" + done + "/" + total + "</span>" +
               "</div>" +
               "<div style='background:#2a2a3a;border-radius:999px;height:5px;'>" +
               "<div style='background:" + color + ";height:5px;border-radius:999px;width:" + pct + "%;'></div>" +
               "</div></div>";
    }

    private String twoPointerLinks() {
        return linkBtn("Two Sum II – Input Array Is Sorted (#167)", "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", "IN PROGRESS — finish this first") +
               linkBtn("3Sum (#15)", "https://leetcode.com/problems/3sum/", "Sort + two pointer") +
               linkBtn("Container With Most Water (#11)", "https://leetcode.com/problems/container-with-most-water/", "Greedy two pointer") +
               linkBtn("Trapping Rain Water (#42)", "https://leetcode.com/problems/trapping-rain-water/", "Hard — do last");
    }

    private String dsaLinks() {
        return linkBtn("NeetCode Roadmap", "https://neetcode.io/roadmap", "Your full 150 roadmap") +
               linkBtn("NeetCode Video Solutions", "https://neetcode.io/practice", "Watch after attempting") +
               linkBtn("LeetCode", "https://leetcode.com", "Practice problems");
    }

    private String motivationBox() {
        return "<div style='background:#ff658422;border:1px solid #ff658444;border-radius:8px;padding:16px;margin-top:8px;'>" +
               "<p style='margin:0;color:#ff9fb4;font-size:13px;line-height:1.7;text-align:center;'>" +
               "🔥 <strong>Remember your why.</strong><br>" +
               "You're building the map you never had — for yourself and everyone who comes after you.<br>" +
               "Two hours today. That's all. Keep going." +
               "</p></div>";
    }
}