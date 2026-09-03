package com.example.salesheet.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2LoginFailureHandler implements AuthenticationFailureHandler {

    private static final String DEFAULT_ERROR_CODE = "login_failed";

    @Value("${app.url}")
    private String appUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        String errorCode = DEFAULT_ERROR_CODE;

        if (exception instanceof OAuth2AuthenticationException oauthException) {
            errorCode = oauthException.getError().getErrorCode();
        }

        response.sendRedirect(appUrl + "/login?error="
                + URLEncoder.encode(errorCode, StandardCharsets.UTF_8));
    }
}
