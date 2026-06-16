package com.dashboard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        sendHtmlEmail(to, subject, wrapPlain(body));
    }

    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("[CyrilHQ] " + subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }

    private String wrapPlain(String body) {
        return baseTemplate(
            "<div style='font-size:15px;line-height:1.7;color:#e8e8f0;white-space:pre-wrap;'>" + body + "</div>",
            "CyrilHQ Reminder"
        );
    }

    public static String baseTemplate(String content, String title) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
            <body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
              <div style="max-width:600px;margin:0 auto;padding:24px 16px;">
                <!-- Header -->
                <div style="background:linear-gradient(135deg,#6c63ff,#ff6584);border-radius:12px;padding:24px;margin-bottom:24px;text-align:center;">
                  <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">⚡ CyrilHQ</h1>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">""" + title + """
</p>
                </div>
                <!-- Content -->
                <div style="background:#111118;border:1px solid #2a2a3a;border-radius:12px;padding:24px;margin-bottom:16px;">
                  """ + content + """
                </div>
                <!-- Footer -->
                <div style="text-align:center;padding:16px 0;">
                  <a href="http://localhost:5173" style="display:inline-block;background:#6c63ff;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:600;">Open CyrilHQ Dashboard →</a>
                  <p style="margin:12px 0 0;color:#6b6b80;font-size:11px;">CyrilHQ · Your personal command center</p>
                </div>
              </div>
            </body>
            </html>
            """;
    }
}