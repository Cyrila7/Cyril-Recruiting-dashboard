package com.dashboard.scheduler;

import com.dashboard.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class WeeklyDigestScheduler {

    @Autowired
    private EmailService emailService;

    // Every Monday at 8:00 AM Eastern Time
    @Scheduled(cron = "0 0 8 * * MON", zone = "America/New_York")
    public void sendWeeklyDigest() {
        String html = EmailService.baseTemplate(weeklyContent(), "Weekly Recruiting Digest");
        emailService.sendHtmlEmail("cyrrilann@gmail.com", "Weekly Recruiting Digest", html);
        System.out.println("Weekly digest sent.");
    }

    // Daily NeetCode reminder at 9:00 AM Eastern Time
    @Scheduled(cron = "0 0 9 * * *", zone = "America/New_York")
    public void sendDailyNeetCode() {
        String html = EmailService.baseTemplate(dailyContent(), "Daily DSA");
        emailService.sendHtmlEmail("cyrrilann@gmail.com", "Daily DSA Reminder", html);
        System.out.println("Daily NeetCode reminder sent.");
    }

    // ===================== DAILY EMAIL =====================

    private String dailyContent() {
        return progressSummaryLine() +
               todaysFocus() +
               progressBars();
    }

    private String progressSummaryLine() {
        return "<p style='margin:0 0 20px;color:#e8e8f0;font-size:14px;'>" +
               "<strong style='color:#43d9ad;'>12/150</strong> complete — next milestone: finish <strong>Two Pointers</strong> (3 left)" +
               "</p>";
    }

    private String todaysFocus() {
        return "<div style='margin-bottom:24px;'>" +
               "<h2 style='margin:0 0 12px;color:#e8e8f0;font-size:14px;font-weight:700;'>🔥 Today's Focus</h2>" +
               "<a href='https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' style='display:block;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;padding:14px 16px;text-decoration:none;margin-bottom:8px;'>" +
               "<span style='color:#e8e8f0;font-size:14px;font-weight:600;'>Two Sum II — Input Array Is Sorted (#167)</span><br>" +
               "<span style='color:#6c63ff;font-size:12px;'>Continue Problem →</span>" +
               "</a>" +
               "<p style='margin:8px 0 0;color:#6b6b80;font-size:12px;'>Up next: 3Sum · Container With Most Water</p>" +
               "</div>";
    }

    private String progressBars() {
        return "<div>" +
               "<h2 style='margin:0 0 12px;color:#e8e8f0;font-size:14px;font-weight:700;'>📊 Your Progress</h2>" +
               progressRow("Arrays & Hashing", 9, 9, "#2ed573") +
               progressRow("Two Pointers", 5, 2, "#ffa502") +
               progressRow("Sliding Window", 6, 0, "#6b6b80") +
               "</div>";
    }

    private String progressRow(String section, int total, int done, String color) {
        int pct = total > 0 ? (done * 100 / total) : 0;
        return "<div style='margin-bottom:10px;'>" +
               "<div style='display:flex;justify-content:space-between;margin-bottom:4px;'>" +
               "<span style='color:#e8e8f0;font-size:12px;'>" + section + "</span>" +
               "<span style='color:#6b6b80;font-size:11px;'>" + done + "/" + total + "</span>" +
               "</div>" +
               "<div style='background:#2a2a3a;border-radius:999px;height:5px;'>" +
               "<div style='background:" + color + ";height:5px;border-radius:999px;width:" + pct + "%;'></div>" +
               "</div></div>";
    }

    // ===================== WEEKLY EMAIL =====================

    private String weeklyContent() {
        return openingsSection() + quickLinksSection();
    }

    private String openingsSection() {
        return "<div style='margin-bottom:24px;'>" +
               "<h2 style='margin:0 0 12px;color:#e8e8f0;font-size:14px;font-weight:700;'>Applications Opening Soon</h2>" +
               dateRow("Amazon SDE Intern", "Jul", "#ff4757") +
               dateRow("Databricks SWE Intern", "Jul", "#ff4757") +
               dateRow("Bloomberg SWE Intern", "Jul", "#ff4757") +
               dateRow("Capital One SWE Intern", "Jul", "#ff4757") +
               dateRow("Microsoft SWE Intern", "Aug", "#ffa502") +
               dateRow("Datadog SWE Intern", "Aug", "#ffa502") +
               dateRow("Ramp SWE Intern", "Aug", "#ffa502") +
               "</div>";
    }

    private String dateRow(String company, String month, String color) {
        return "<div style='display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #2a2a3a;'>" +
               "<span style='color:#e8e8f0;font-size:13px;'>" + company + "</span>" +
               "<span style='color:" + color + ";font-size:11px;font-weight:600;'>" + month + "</span>" +
               "</div>";
    }

    private String quickLinksSection() {
        return "<a href='https://www.intern-list.com' style='display:block;background:#6c63ff;color:#fff;text-decoration:none;padding:12px;border-radius:8px;text-align:center;font-size:13px;font-weight:700;'>View All Openings →</a>";

    }
}