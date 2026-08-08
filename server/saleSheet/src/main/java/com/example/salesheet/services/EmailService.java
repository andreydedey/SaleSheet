package com.example.salesheet.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    @Value("${app.url}")
    private String appUrl;

    @Async
    public void sendInvite(String toEmail, String toName) {
        try {
            var message = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(from);
            helper.setTo(toEmail);
            helper.setSubject("Você foi convidado para o SaleSheet");
            helper.setText(buildInviteHtml(toName, appUrl), true);

            mailSender.send(message);
            log.info("Invite email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send invite email to {}", toEmail, e);
        }
    }

    private String buildInviteHtml(String name, String url) {
        return """
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                  <h2 style="color: #111;">Olá, %s!</h2>
                  <p>Você foi convidado para acessar o <strong>SaleSheet</strong>, a plataforma de gestão de planilhas de vendas.</p>
                  <p>Clique no botão abaixo para acessar o sistema:</p>
                  <a href="%s" style="
                    display: inline-block;
                    margin-top: 12px;
                    padding: 10px 20px;
                    background-color: #16a34a;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                  ">Acessar SaleSheet</a>
                  <p style="margin-top: 24px; color: #6b7280; font-size: 13px;">
                    Se você não esperava este convite, ignore este email.
                  </p>
                </div>
                """.formatted(name, url);
    }
}
