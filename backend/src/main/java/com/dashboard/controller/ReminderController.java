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
@CrossOrigin(origins = {"http://localhost:5173", "https://*.vercel.app"})
public class ReminderController {

    @Autowired
    private EmailService emailService;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(5);

    // Plain text email
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

    // HTML email
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

    // Schedule a plain text reminder
    @PostMapping("/schedule")
    public ResponseEntity<?> schedule(@RequestBody Map<String, String> req) {
        try {
            LocalDateTime target = LocalDateTime.parse(
                req.get("scheduledTime").substring(0, 16),
                DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm")
            );
            long delaySeconds = java.time.Duration.between(LocalDateTime.now(), target).getSeconds();
            if (delaySeconds <= 0) return ResponseEntity.badRequest().body(Map.of("error", "Time must be in the future"));

            scheduler.schedule(() -> {
                try {
                    emailService.sendEmail(
                        req.getOrDefault("to", "cyrrilann@gmail.com"),
                        req.getOrDefault("subject", "Scheduled Reminder"),
                        req.getOrDefault("message", "")
                    );
                } catch (Exception e) {
                    System.err.println("Scheduled email failed: " + e.getMessage());
                }
            }, delaySeconds, TimeUnit.SECONDS);

            return ResponseEntity.ok(Map.of("status", "scheduled", "delaySeconds", delaySeconds));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "CyrilHQ backend running ✅"));
    }
}