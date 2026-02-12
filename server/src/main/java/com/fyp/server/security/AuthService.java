package com.fyp.server.security;


import com.fyp.server.entity.User;
import com.fyp.server.entity.UserRole;
import com.fyp.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NullMarked;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.fyp.server.dto.loginResponseDTO;
import com.fyp.server.dto.loginRequestDTO;
import com.fyp.server.dto.SignUpRequestDTO;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final AuthUtil authUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;



    public loginResponseDTO login(loginRequestDTO loginRequestDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        if (user == null) {
            throw new BadCredentialsException("Authentication principal is null");
        }

        // Validate that the user has the requested role
        String requestedRole = loginRequestDto.getRole();
        if (requestedRole != null && !requestedRole.isEmpty()) {
            UserRole expectedRole = UserRole.valueOf(requestedRole.toUpperCase());
            boolean hasRole = user.getRoles().contains(expectedRole);
            if (!hasRole) {
                throw new BadCredentialsException("User does not have the required role: " + requestedRole);
            }
        }

        String token = authUtil.generateAccessToken(user);

         loginResponseDTO resp = new loginResponseDTO();
        resp.setJwt(token);
        resp.setId(user.getId());
        resp.setRole(requestedRole != null ? requestedRole.toUpperCase() : "USER");
        return resp;
    }

    public User signUpInternal(SignUpRequestDTO signupRequestDto) {
        User user = userRepository.findByEmail(signupRequestDto.getEmail()).orElse(null);

        if(user != null) throw new IllegalArgumentException("User already exists");



//        if(authProviderType == AuthProviderType.EMAIL) {
//            user.setPassword(passwordEncoder.encode(signupRequestDto.getPassword()));
//        }
        if(signupRequestDto.getPassword() !=null)
            user = User.builder()
                .name(signupRequestDto.getName())
                .email(signupRequestDto.getEmail())
                .password(passwordEncoder.encode(signupRequestDto.getPassword()))
                    .roles(signupRequestDto.getRole())
                .build();

        if(user != null)
            user = userRepository.save(user);

//        Patient patient = Patient.builder()
//                .name(signupRequestDto.getName())
//                .email(signupRequestDto.getUsername())
//                .user(user)
//                .build();
//        patientRepository.save(patient);

        return user;
    }

    // login controller
//    public SignupResponseDto signup(SignUpRequestDto signupRequestDto) {
//        User user = signUpInternal(signupRequestDto, AuthProviderType.EMAIL, null);
//        return new SignupResponseDto(user.getId(), user.getUsername());
//    }
}
