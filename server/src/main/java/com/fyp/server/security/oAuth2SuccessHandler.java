package com.fyp.server.security;

import com.fyp.server.entity.AuthProviderType;
import com.fyp.server.entity.User;
import com.fyp.server.entity.UserRole;
import com.fyp.server.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class oAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final AuthUtil authUtil;

    @Value("${frontend.url:https://fyp-chemai.vercel.app}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        try {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User oAuth2User = oauthToken.getPrincipal();
            String registrationId = oauthToken.getAuthorizedClientRegistrationId(); // "google", "github"

            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");
            String providerId = oAuth2User.getAttribute("sub"); // Google uses "sub"

            // For GitHub, the subject/id attribute is different
            if ("github".equals(registrationId)) {
                Object idAttr = oAuth2User.getAttribute("id");
                providerId = idAttr != null ? idAttr.toString() : null;
                // GitHub may not return email if it's private
                if (email == null) {
                    email = oAuth2User.getAttribute("login") + "@github.com";
                }
            }

            if (email == null) {
                log.error("OAuth2 login failed: email is null for provider {}", registrationId);
                String errorUrl = frontendUrl + "/oauth/callback?error=" +
                        URLEncoder.encode("Could not retrieve email from provider.", StandardCharsets.UTF_8);
                getRedirectStrategy().sendRedirect(request, response, errorUrl);
                return;
            }

            AuthProviderType providerType = AuthProviderType.valueOf(registrationId.toUpperCase());

            // Find or create user
            User user = findOrCreateUser(email, name, providerId, providerType);

            // Generate JWT token
            String token = authUtil.generateAccessToken(user);

            // Determine role
            String role = user.getRoles().isEmpty() ? "USER" :
                    user.getRoles().iterator().next().getAuthority();

            // Redirect to frontend with token, userId, and role
            String redirectUrl = frontendUrl + "/oauth/callback"
                    + "?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8)
                    + "&userId=" + URLEncoder.encode(user.getId(), StandardCharsets.UTF_8)
                    + "&role=" + URLEncoder.encode(role, StandardCharsets.UTF_8);

            log.info("OAuth2 login successful for user: {}, redirecting to frontend", email);
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);

        } catch (Exception e) {
            log.error("OAuth2 login error: {}", e.getMessage(), e);
            String errorUrl = frontendUrl + "/oauth/callback?error=" +
                    URLEncoder.encode("Authentication failed: " + e.getMessage(), StandardCharsets.UTF_8);
            getRedirectStrategy().sendRedirect(request, response, errorUrl);
        }
    }

    private User findOrCreateUser(String email, String name, String providerId, AuthProviderType providerType) {
        // First try to find by email
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // Update provider info if not already set
            if (user.getProviderId() == null) {
                user.setProviderId(providerId);
                user.setProviderType(providerType);
                userRepository.save(user);
            }
            return user;
        }

        // Try to find by provider ID
        Optional<User> providerUser = userRepository.findByProviderIdAndProviderType(providerId, providerType);
        if (providerUser.isPresent()) {
            return providerUser.get();
        }

        // Create new user
        Set<UserRole> roles = new HashSet<>();
        roles.add(UserRole.USER);

        User newUser = User.builder()
                .name(name)
                .email(email)
                .providerId(providerId)
                .providerType(providerType)
                .roles(roles)
                .build();

        return userRepository.save(newUser);
    }
}
