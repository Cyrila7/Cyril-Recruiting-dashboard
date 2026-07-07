package com.dashboard.jobs;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "seen_jobs")
public class SeenJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String externalJobId;
    private String title;
    private String url;
    private Instant firstSeenAt;

    public SeenJob() {} // constructor for jpa builds your database basically to work with the database.

    public SeenJob(String companyName, String externalJobId, String title, String url) {
        this.companyName = companyName;
        this.externalJobId = externalJobId;
        this.title = title;
        this.url = url;
        this.firstSeenAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getCompanyName() { return companyName; }
    public String getExternalJobId() { return externalJobId; }
    public String getTitle() { return title; }
    public String getUrl() { return url; }
    public Instant getFirstSeenAt() { return firstSeenAt; }
}