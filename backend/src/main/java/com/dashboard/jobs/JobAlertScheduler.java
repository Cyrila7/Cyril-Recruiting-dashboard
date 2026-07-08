package com.dashboard.jobs;

import com.dashboard.jobs.CompanyAtsConfig.CompanyConfig;
import com.dashboard.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class JobAlertScheduler {

    @Autowired private GreenhousePoller greenhousePoller;
    @Autowired private AshbyPoller ashbyPoller;
    @Autowired private AdzunaPoller adzunaPoller;
    @Autowired private SeenJobRepository seenJobRepository;
    @Autowired private EmailService emailService;

    private static final String ALERT_EMAIL = "cyrrilann@gmail.com";
    private static final int MAX_EMAILS_PER_CYCLE = 10;

    @Scheduled(fixedRate = 900000)
    public void pollForNewJobs() {
        int emailsSentThisCycle = 0;
        emailsSentThisCycle += pollTargetCompanies();
        emailsSentThisCycle += pollAdzuna(emailsSentThisCycle);

        System.out.println("Job poll complete. Emails sent this cycle: " + emailsSentThisCycle);
    }

    private int pollTargetCompanies() {
    int sent = 0;
    for (CompanyConfig company : CompanyAtsConfig.COMPANIES) {
        List<JobPosting> jobs = switch (company.atsType()) {
            case GREENHOUSE -> greenhousePoller.fetchJobs(company.boardToken(), company.euHost());
            case ASHBY -> ashbyPoller.fetchJobs(company.boardToken());
        };

        boolean isFirstRunForCompany = seenJobRepository.countByCompanyName(company.companyName()) == 0;

        for (JobPosting job : jobs) {
            if (sent >= MAX_EMAILS_PER_CYCLE) return sent;

            // Extra per-company keyword filter (e.g. Anduril → only "intern" roles) so you dont keep getting all their companies roles thats why its here 
            if (company.requiredKeyword() != null &&
                !job.title().toLowerCase().contains(company.requiredKeyword().toLowerCase())) {
                continue;
            }

            boolean alreadySeen = seenJobRepository.existsByCompanyNameAndExternalJobId(
                company.companyName(), job.externalId()
            );
            if (alreadySeen) continue;

            seenJobRepository.save(new SeenJob(
                company.companyName(), job.externalId(), job.title(), job.url()
            ));

            if (!isFirstRunForCompany) {
                sendAlertEmail(company.companyName(), job.title(), job.url());
                sent++;
            }
        }
        }
    return sent;
        }

    private int pollAdzuna(int alreadySentThisCycle) {
        int sent = 0;
        List<AdzunaPosting> jobs = adzunaPoller.fetchJobs();

        boolean isFirstRunForAdzuna = seenJobRepository.countByCompanyName("Adzuna-Discovery") == 0;

        for (AdzunaPosting job : jobs) {
            if (alreadySentThisCycle + sent >= MAX_EMAILS_PER_CYCLE) break;

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
        String content = "<div style='margin-bottom:16px;'>" +
            "<h2 style='margin:0 0 12px;color:#e8e8f0;font-size:14px;font-weight:700;'>🚨 New Opening</h2>" +
            "<a href='" + url + "' style='display:block;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;padding:14px 16px;text-decoration:none;'>" +
            "<span style='color:#e8e8f0;font-size:14px;font-weight:600;'>" + title + "</span><br>" +
            "<span style='color:#6c63ff;font-size:12px;'>" + companyName + " → View & Apply</span>" +
            "</a></div>";

        String html = EmailService.baseTemplate(content, "New Job Alert");
        emailService.sendHtmlEmail(ALERT_EMAIL, "New opening at " + companyName, html);
        System.out.println("Alert sent: " + companyName + " — " + title);
    }
}