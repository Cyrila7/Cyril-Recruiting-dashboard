package com.dashboard.jobs;

import com.dashboard.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class JobAlertScheduler {

    @Autowired private AdzunaPoller adzunaPoller;
    @Autowired private SeenJobRepository seenJobRepository;
    @Autowired private EmailService emailService;

    private static final String ALERT_EMAIL = "cyrrilann@gmail.com";
    private static final int MAX_EMAILS_PER_CYCLE = 10;

    // Companies where a matching Summer 2027 internship should stand out immediately.
    // Keep this list small and easy to edit.
    private static final List<String> TARGET_COMPANIES = List.of(
        "adobe",
        "airbnb",
        "amazon",
        "american express",
        "apple",
        "astranis",
        "atlassian",
        "block",
        "bloomberg",
        "capital one",
        "cisco",
        "coinbase",
        "databricks",
        "datadog",
        "doordash",
        "dropbox",
        "ebay",
        "figma",
        "fidelity",
        "google",
        "grow therapy",
        "hubspot",
        "ibm",
        "intuit",
        "jpmorgan",
        "linkedin",
        "lyft",
        "mastercard",
        "meta",
        "microsoft",
        "mongodb",
        "netflix",
        "notion",
        "nvidia",
        "oracle",
        "palantir",
        "paypal",
        "reddit",
        "rippling",
        "robinhood",
        "salesforce",
        "servicenow",
        "shopify",
        "snowflake",
        "spotify",
        "stripe",
        "tiktok",
        "uber",
        "visa",
        "walmart"
    );
    @Scheduled(fixedRate = 900000)
    public void pollForNewJobs() {
        int emailsSentThisCycle = pollAdzuna();

        System.out.println("Job poll complete. Emails sent this cycle: " + emailsSentThisCycle);
    }

    private int pollAdzuna() {
        int sent = 0;
        List<AdzunaPosting> jobs = adzunaPoller.fetchJobs();

        boolean isFirstRunForAdzuna = seenJobRepository.countByCompanyName("Adzuna-Discovery") == 0;

        for (AdzunaPosting job : jobs) {
            if (sent >= MAX_EMAILS_PER_CYCLE) break;

            String sourceKey = "Adzuna-Discovery";
            boolean alreadySeen = seenJobRepository.existsByCompanyNameAndExternalJobId(sourceKey, job.id());
            if (alreadySeen) continue;

            seenJobRepository.save(new SeenJob(sourceKey, job.id(), job.title(), job.url()));

            if (!isFirstRunForAdzuna) {
                sendAlertEmail(job.company(), job.title(), job.url());
                sent++;
            }
        }
        return sent;
    }

    private void sendAlertEmail(String companyName, String title, String url) {
        String priorityLabel = getPriorityLabel(companyName, title);
        boolean highPriority = priorityLabel != null;

        String heading = highPriority ? priorityLabel : "🚨 New Opening";
        String subject = highPriority
            ? priorityLabel + " — " + companyName
            : "New opening at " + companyName;

        String content = "<div style='margin-bottom:16px;'>" +
            "<h2 style='margin:0 0 12px;color:#e8e8f0;font-size:14px;font-weight:700;'>" + heading + "</h2>" +
            "<a href='" + url + "' style='display:block;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;padding:14px 16px;text-decoration:none;'>" +
            "<span style='color:#e8e8f0;font-size:14px;font-weight:600;'>" + title + "</span><br>" +
            "<span style='color:#6c63ff;font-size:12px;'>" + companyName + " → View & Apply</span>" +
            "</a></div>";

        String html = EmailService.baseTemplate(content, highPriority ? "High Priority Job Alert" : "New Job Alert");
        emailService.sendHtmlEmail(ALERT_EMAIL, subject, html);
        System.out.println((highPriority ? "HIGH PRIORITY alert sent: " : "Alert sent: ") + companyName + " — " + title);
    }

    // Returns a special label for strong 2027 internship matches.
    // null means it is still a normal alert. No jobs are filtered out.
    private String getPriorityLabel(String companyName, String title) {
        String company = companyName.toLowerCase();
        String jobTitle = title.toLowerCase();

        boolean targetCompany = TARGET_COMPANIES.stream().anyMatch(company::contains);
        boolean is2027Internship = jobTitle.contains("2027") && jobTitle.contains("intern");

        if (!targetCompany || !is2027Internship) {
            return null;
        }

        boolean isSwe = jobTitle.contains("software")
            || jobTitle.contains("engineer")
            || jobTitle.contains("developer");

        boolean isPm = jobTitle.contains("product manager")
            || jobTitle.contains("product management")
            || jobTitle.contains("product intern");

        if (isPm) return "🔥 PM TARGET";
        if (isSwe) return "🔥 SWE TARGET";

        return "🔥 HIGH PRIORITY";
    }
}
