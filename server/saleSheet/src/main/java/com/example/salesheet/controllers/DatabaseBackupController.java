package com.example.salesheet.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/admin/backup")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DatabaseBackupController {

    @Value("${spring.datasource.url}")
    private String databaseUrl;

    @Value("${spring.datasource.username}")
    private String dbUser;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @GetMapping("/dump")
    public ResponseEntity<byte[]> dumpDatabase() {
        try {
            // Extrair informações do JDBC URL
            String jdbcUrl = databaseUrl;
            if (!jdbcUrl.startsWith("jdbc:")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid database URL format".getBytes());
            }

            // Executar pg_dump
            ProcessBuilder pb = new ProcessBuilder(
                    "pg_dump",
                    "-h", extractHost(jdbcUrl),
                    "-p", extractPort(jdbcUrl),
                    "-U", dbUser,
                    "-d", extractDatabase(jdbcUrl)
            );

            // Configurar variável de ambiente para password
            pb.environment().put("PGPASSWORD", dbPassword);

            Process process = pb.start();

            // Capturar o output
            ByteArrayOutputStream result = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int length;

            try (InputStream is = process.getInputStream()) {
                while ((length = is.read(buffer)) != -1) {
                    result.write(buffer, 0, length);
                }
            }

            // Capturar erros se houver
            StringBuilder errorOutput = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    errorOutput.append(line).append("\n");
                }
            }

            // Aguardar conclusão
            if (!process.waitFor(5, TimeUnit.MINUTES)) {
                process.destroyForcibly();
                return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT)
                        .body("Database dump timeout".getBytes());
            }

            if (process.exitValue() != 0) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(("Pg_dump error: " + errorOutput.toString()).getBytes());
            }

            // Gerar nome do arquivo com timestamp
            String timestamp = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "salesheet_dump_" + timestamp + ".sql";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, "application/sql; charset=utf-8")
                    .contentLength(result.size())
                    .body(result.toByteArray());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Error during backup: " + e.getMessage()).getBytes());
        }
    }

    private String extractHost(String jdbcUrl) {
        // jdbc:postgresql://host:port/database
        String url = jdbcUrl.replace("jdbc:postgresql://", "");
        return url.split(":")[0];
    }

    private String extractPort(String jdbcUrl) {
        // jdbc:postgresql://host:port/database
        String url = jdbcUrl.replace("jdbc:postgresql://", "");
        String[] parts = url.split(":");
        if (parts.length > 1) {
            return parts[1].split("/")[0];
        }
        return "5432";
    }

    private String extractDatabase(String jdbcUrl) {
        // jdbc:postgresql://host:port/database
        return jdbcUrl.substring(jdbcUrl.lastIndexOf("/") + 1);
    }
}

