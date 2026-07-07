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
    @Autowired private SeenJobRepository seenJobRepository;
    @Autowired private EmailService emailService;

    private static final String ALERT_EMAIL = "cyrrilann@gmail.com";

    @Scheduled(fixedRate = 900000) // every 15 minutes
    public void pollForNewJobs() {
        for (CompanyConfig company : CompanyAtsConfig.COMPANIES) {
            List<JobPosting> jobs = switch (company.atsType()) {
                case GREENHOUSE -> greenhousePoller.fetchJobs(company.boardToken(), company.euHost());
                case ASHBY -> ashbyPoller.fetchJobs(company.boardToken());
            };

            for (JobPosting job : jobs) {
                boolean alreadySeen = seenJobRepository.existsByCompanyNameAndExternalJobId(
                    company.companyName(), job.externalId()
                );
                if (alreadySeen) continue;

                seenJobRepository.save(new SeenJob(
                    company.companyName(), job.externalId(), job.title(), job.url()
                ));

                sendAlertEmail(company.companyName(), job);
            }
        }
        System.out.println("Job poll complete: " + CompanyAtsConfig.COMPANIES.size() + " companies checked.");
    }

    private void sendAlertEmail(String companyName, JobPosting job) {
        String content = "<div style='margin-bottom:16px;'>" +
            "<h2 style='margin:0 0 12px;color:#e8e8f0;font-size:14px;font-weight:700;'>🚨 New Opening</h2>" +
            "<a href='" + job.url() + "' style='display:block;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;padding:14px 16px;text-decoration:none;'>" +
            "<span style='color:#e8e8f0;font-size:14px;font-weight:600;'>" + job.title() + "</span><br>" +
            "<span style='color:#6c63ff;font-size:12px;'>" + companyName + " → View & Apply</span>" +
            "</a></div>";

        String html = EmailService.baseTemplate(content, "New Job Alert");
        emailService.sendHtmlEmail(ALERT_EMAIL, "New opening at " + companyName, html);
        System.out.println("Alert sent: " + companyName + " — " + job.title());
    }
}