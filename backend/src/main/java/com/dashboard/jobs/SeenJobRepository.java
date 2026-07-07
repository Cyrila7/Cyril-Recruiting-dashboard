package com.dashboard.jobs;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SeenJobRepository extends JpaRepository<SeenJob, Long> {
    boolean existsByCompanyNameAndExternalJobId(String companyName, String externalJobId);
    long countByCompanyName(String companyName);
}