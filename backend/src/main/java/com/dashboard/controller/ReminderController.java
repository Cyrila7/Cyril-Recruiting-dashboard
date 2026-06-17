package com.dashboard.controller;

import com.dashboard.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ReminderController {

    @Autowired
    private EmailService emailService;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(5);

    @PostMapping("/send")
    public ResponseEntity<?> sendNow(@RequestBody Map<String, String> req) {
        try {
            emailService.sendEmail(
                req.getOrDefault("to", "cyrrilann@gmail.com"),
                req.getOrDefault("subject", "Reminder"),
                req.getOrDefault("message", "")
            );
            return ResponseEntity.ok(Map.of("status", "sent"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/send-html")
    public ResponseEntity<?> sendHtml(@RequestBody Map<String, String> req) {
        try {
            String html = EmailService.baseTemplate(
                req.getOrDefault("html", "<p>No content</p>"),
                req.getOrDefault("subject", "CyrilHQ Reminder")
            );
            emailService.sendHtmlEmail(
                req.getOrDefault("to", "cyrrilann@gmail.com"),
                req.getOrDefault("subject", "Reminder"),
                html
            );
            return ResponseEntity.ok(Map.of("status", "sent"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/schedule")
    public ResponseEntity<?> schedule(@RequestBody Map<String, String> req) {
        try {
            // Frontend sends local datetime (e.g. America/New_York). Parse as that zone explicitly.
            java.time.ZoneId userZone = java.time.ZoneId.of("America/New_York");
            LocalDateTime targetLocal = LocalDateTime.parse(
                req.get("scheduledTime").substring(0, 16),
                DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm")
            );
            java.time.ZonedDateTime targetZoned = targetLocal.atZone(userZone);
            java.time.ZonedDateTime nowZoned = java.time.ZonedDateTime.now(userZone);

            long delaySeconds = java.time.Duration.between(nowZoned, targetZoned).getSeconds();
            if (delaySeconds <= 0) return ResponseEntity.badRequest().body(Map.of("error", "Time must be in the future", "delaySeconds", delaySeconds));

            scheduler.schedule(() -> {
                try {
                    String html = EmailService.baseTemplate(
                        "<div style='font-size:15px;line-height:1.7;color:#e8e8f0;white-space:pre-wrap;'>" + req.getOrDefault("message", "") + "</div>",
                        "CyrilHQ Reminder"
                    );
                    emailService.sendHtmlEmail(
                        req.getOrDefault("to", "cyrrilann@gmail.com"),
                        req.getOrDefault("subject", "Scheduled Reminder"),
                        html
                    );
                    System.out.println("Scheduled email sent successfully at " + java.time.ZonedDateTime.now(userZone));
                } catch (Exception e) {
                    System.err.println("Scheduled email failed: " + e.getMessage());
                }
            }, delaySeconds, TimeUnit.SECONDS);

            return ResponseEntity.ok(Map.of("status", "scheduled", "delaySeconds", delaySeconds, "willSendAt", targetZoned.toString()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "CyrilHQ backend running ✅"));
    }
}