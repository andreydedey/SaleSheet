package com.example.salesheet.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();

        String redirectUrl = switch (principal.getUser().getRole()) {
            case ADMIN -> "http://127.0.0.1:5173/dashboard";
            case SALESPERSON -> "http://127.0.0.1:5173/salesperson/home";
        };

        response.sendRedirect(redirectUrl);
    }
}
