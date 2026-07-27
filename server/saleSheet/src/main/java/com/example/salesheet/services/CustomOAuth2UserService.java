package com.example.salesheet.services;

import com.example.salesheet.entities.User;
import com.example.salesheet.enums.Status;
import com.example.salesheet.repositories.UserRepository;
import com.example.salesheet.security.CustomUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oauthUser = super.loadUser(oAuth2UserRequest);

        String email = oauthUser.getAttribute("email");
        String subject = oauthUser.getAttribute("sub"); // Google's unique user ID
        String provider = oAuth2UserRequest.getClientRegistration().getRegistrationId(); // "google"

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new OAuth2AuthenticationException(
                   new OAuth2Error("not_invited"), "User not invited: " + email
                ));

        if (user.getStatus() == Status.PENDING) {
            user.setStatus(Status.ACTIVE);
            user.setOauthSubject(subject);
            user.setOauthProvider(provider);
            user = userRepository.save(user);
        }

        return new CustomUserPrincipal(user, oauthUser.getAttributes());
    }
}
