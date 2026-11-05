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

    // Circuit breaker: pause Adzuna requests after upstream 503/429 responses.
    private static final long COOLDOWN_MILLIS = 30 * 60 * 1000L;
    private volatile long adzunaRetryAfterMillis = 0L;

    private static final List<String> QUERIES = List.of(
        "software engineer intern",
        "software engineer intern 2027",
        "software engineer co-op spring 2027",
        "software developer co-op spring 2027",
        "software engineering co-op 2027",
        "product manager intern",
        "product management intern 2027",
        "product management intern spring 2027",
        "product management co-op spring 2027",
        "product management intern winter 2027",
        "product strategy intern spring 2027"
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
        "parsons",
        "mitre",
        "jacobs engineering",
        "amentum"
    );

    // Keywords in the description that signal a clearance-gated defense/gov role.
    // Description text from Adzuna's search endpoint is often truncated, so this
    // is a secondary net, not a primary filter — the company blocklist above
    // catches most of the volume.
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
        if (System.currentTimeMillis() < adzunaRetryAfterMillis) {
            System.out.println("Adzuna polling skipped: upstream cooldown active.");
            return List.of();
        }
        // Dedup across all queries by job id, since they'll overlap a lot
        Map<String, AdzunaPosting> results = new LinkedHashMap<>();
        for (String query : QUERIES) {
            if (System.currentTimeMillis() < adzunaRetryAfterMillis) break;
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
            HttpResponse<String> response = null;

            // Avoid hammering an unavailable or rate-limited upstream service.
            // 503 and 429 activate a shared 30-minute cooldown for all queries.
            for (int attempt = 1; attempt <= 3; attempt++) {
                response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                int status = response.statusCode();

                if (status == 200) break;

                System.err.println("Adzuna HTTP " + status + " for '" + rawQuery
                    + "' (attempt " + attempt + "/3).");

                if (status == 503 || status == 429) {
                    adzunaRetryAfterMillis = System.currentTimeMillis() + COOLDOWN_MILLIS;
                    System.err.println("Adzuna unavailable/rate-limited; pausing requests for 30 minutes.");
                    return results;
                }

                if ((status != 502 && status != 504) || attempt == 3) return results;

                Thread.sleep(attempt * 2000L);
            }

            JsonNode root = mapper.readTree(response.body());
            JsonNode jobs = root.path("results");

            for (JsonNode job : jobs) {
                String title = job.path("title").asText("");
                String company = job.path("company").path("display_name").asText("Unknown");
                String description = job.path("description").asText("");

                if (!isRelevant(title, rawQuery)) continue;
                if (isBlockedCompany(company)) continue;
                if (requiresClearance(description)) continue;

                results.add(new AdzunaPosting(
                    job.path("id").asText(""),
                    title,
                    company,
                    job.path("redirect_url").asText(""),
                    job.path("created").asText(""),
                    job.path("location").path("display_name").asText("")
                ));
            }
        } catch (Exception e) {
            System.err.println("AdzunaPoller error for '" + rawQuery + "': " + e.getClass().getSimpleName()
                + (e.getMessage() != null ? " - " + e.getMessage() : ""));
            e.printStackTrace();
        }
        return results;
    }

    // isRelevant branches by query type: SWE queries filter for engineer/developer
    // titles, while product queries accept PM/APM plus product strategy titles.
    // Both exclude senior-level titles either way.
    private boolean isRelevant(String title, String sourceQuery) {
        String t = title.toLowerCase();
        boolean isSenior = t.contains("senior") || t.contains("staff") || t.contains("principal")
                         || t.contains("lead") || t.contains("director") || t.contains("manager")
                             && !t.contains("product manager"); // don't exclude "product manager" itself

        boolean isPmQuery = sourceQuery.toLowerCase().contains("product manager")
                          || sourceQuery.toLowerCase().contains("product management")
                          || sourceQuery.toLowerCase().contains("product strategy");

        if (isPmQuery) {
            boolean isPm = t.contains("product manager") || t.contains("product management")
                         || t.contains("associate product manager") || t.contains("apm")
                         || t.contains("product strategy");
            return isPm && !isSenior && matchesCoopQuery(t, sourceQuery);
        } else {
            boolean isSwe = t.contains("software engineer") || t.contains("swe") || t.contains("developer");
            return isSwe && !isSenior && matchesCoopQuery(t, sourceQuery);
        }
    }

    // Co-op searches should not generate ordinary internship alerts. Other queries retain existing behavior.
    private boolean matchesCoopQuery(String title, String sourceQuery) {
        if (!sourceQuery.toLowerCase().contains("co-op")) return true;
        return title.contains("co-op") || title.contains("coop") || title.contains("co op");
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
