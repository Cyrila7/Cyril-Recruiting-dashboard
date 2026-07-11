package com.dashboard.jobs;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class AdzunaPoller {

    @Value("${adzuna.app.id}")
    private String appId;

    @Value("${adzuna.app.key}")
    private String appKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    private static final List<String> QUERIES = List.of(
        "software engineer intern",
        "software engineer intern 2027"
    );

    // Company name fragments to exclude (matched as substrings, lowercase).
    // Add to this list as new defense/gov contractors show up in your feed.
    private static final Set<String> BLOCKED_COMPANIES = Set.of(
        "northrop grumman",
        "bae systems",
        "caci",
        "leonardo drs",
        "lockheed martin",
        "raytheon",
        "rtx",
        "general dynamics",
        "l3harris",
        "boeing defense",
        "kbr",
        "leidos",
        "teleworld solutions",
        "booz allen",
        "saic",
        "peraton",
        "parsons corporation",
        "mitre",
        "jacobs engineering",
        "amentum"
    );

    // Keywords in the description that signal a clearance-gated defense/gov role.
    // Description text from Adzuna's search endpoint is often truncated, so this
    // is a secondary net, not a primary filter  the company blocklist above
    // catches most of the volume. keep in mind that if you fork it you can always change it this just myyy prefrences.
    private static final Set<String> CLEARANCE_KEYWORDS = Set.of(
        "security clearance",
        "u.s. citizenship required",
        "us citizenship required",
        "dod ",
        "secret clearance",
        "top secret",
        "active clearance",
        "polygraph"
    );

    public List<AdzunaPosting> fetchJobs() {
        // Dedup across both queries by job id, since they'll overlap a lot
        Map<String, AdzunaPosting> results = new LinkedHashMap<>();
        for (String query : QUERIES) {
            for (AdzunaPosting posting : fetchForQuery(query)) {
                results.putIfAbsent(posting.id(), posting);
            }
        }
        return new ArrayList<>(results.values());
    }

    private List<AdzunaPosting> fetchForQuery(String rawQuery) {
        List<AdzunaPosting> results = new ArrayList<>();
        try {
            String query = URLEncoder.encode(rawQuery, StandardCharsets.UTF_8);
            String url = "https://api.adzuna.com/v1/api/jobs/us/search/1"
                + "?app_id=" + appId
                + "&app_key=" + appKey
                + "&what=" + query
                + "&sort_by=date"
                + "&max_days_old=2"
                + "&results_per_page=30"
                + "&category=it-jobs"
                + "&content-type=application/json";

            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                System.err.println("Adzuna fetch failed for '" + rawQuery + "': " + response.statusCode());
                return results;
            }

            JsonNode root = mapper.readTree(response.body());
            JsonNode jobs = root.path("results");

            for (JsonNode job : jobs) {
                String title = job.path("title").asText("");
                String company = job.path("company").path("display_name").asText("Unknown");
                String description = job.path("description").asText("");

                if (!isRelevant(title)) continue;
                if (isBlockedCompany(company)) continue;
                if (requiresClearance(description)) continue;

                results.add(new AdzunaPosting(
                    job.path("id").asText(),
                    title,
                    company,
                    job.path("redirect_url").asText(""),
                    job.path("created").asText("")
                ));
            }
        } catch (Exception e) {
            System.err.println("AdzunaPoller error for '" + rawQuery + "': " + e.getMessage());
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

    private boolean isBlockedCompany(String company) {
        String c = company.toLowerCase();
        return BLOCKED_COMPANIES.stream().anyMatch(c::contains);
    }

    private boolean requiresClearance(String description) {
        String d = description.toLowerCase();
        return CLEARANCE_KEYWORDS.stream().anyMatch(d::contains);
    }
}
