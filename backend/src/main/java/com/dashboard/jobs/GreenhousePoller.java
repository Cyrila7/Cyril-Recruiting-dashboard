package com.dashboard.jobs;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

@Component
public class GreenhousePoller {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public List<JobPosting> fetchJobs(String boardToken, boolean euHost) {
        String host = euHost ? "boards-api.eu.greenhouse.io" : "boards-api.greenhouse.io";
        String url = "https://" + host + "/v1/boards/" + boardToken + "/jobs";
        List<JobPosting> results = new ArrayList<>();

        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                System.err.println("Greenhouse fetch failed for " + boardToken + ": " + response.statusCode());
                return results;
            }

            JsonNode root = mapper.readTree(response.body());
            JsonNode jobs = root.path("jobs");

            for (JsonNode job : jobs) {
                String title = job.path("title").asText("");
                if (!isRelevant(title)) continue;

                results.add(new JobPosting(
                    job.path("id").asText(),
                    title,
                    job.path("absolute_url").asText(""),
                    job.path("updated_at").asText("")
                ));
            }
        } catch (Exception e) {
            System.err.println("GreenhousePoller error for " + boardToken + ": " + e.getMessage());
        }

        return results;
    }

    private boolean isRelevant(String title) {
    String t = title.toLowerCase();
    boolean isSwe = t.contains("software engineer") || t.contains("swe") || t.contains("developer");
    boolean isSenior = t.contains("senior") || t.contains("staff") || t.contains("principal")
                     || t.contains("lead") || t.contains("director") || t.contains("manager");
    return isSwe && !isSenior;
    }
}