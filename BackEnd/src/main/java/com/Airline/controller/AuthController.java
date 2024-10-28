package com.Airline.controller;

import com.Airline.DTO.JwtResponse;
import com.Airline.DTO.LoginRequest;
import com.Airline.DTO.RegisterRequest;
import com.Airline.Security.Jwt.JwtTokenUtil;
import com.Airline.Security.services.UserDetailsServiceImpl;
import com.Airline.enums.Role;
import com.Airline.model.PasswordResetToken;
import com.Airline.model.User;
import com.Airline.repository.UserRepository;
import com.Airline.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsServiceImpl userDetailsService;

    @Autowired
    private UserService userService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenUtil jwtTokenUtil,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          UserDetailsServiceImpl userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        Map<String, String> errors = new HashMap<>();
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            errors.put("usernameError", "Username is already taken!");
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            errors.put("emailError", "Email is already in use!");
        }
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            errors.put("passwordError", "Passwords do not match!");
        }
        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        User newUser = new User();
        newUser.setFirstName(registerRequest.getFirstName());
        newUser.setLastName(registerRequest.getLastName());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setUsername(registerRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        Set<Role> userRoles = new HashSet<>();
        userRoles.add(Role.ROLE_USER);
        newUser.setRoles(userRoles);
        userRepository.save(newUser);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtTokenUtil.generateToken(authentication);

            User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(
                    () -> new UsernameNotFoundException("User not found")
            );

            Set<String> roles = user.getRoles().stream()
                    .map(Enum::name) // Directly using the name() method of the Enum class
                    .collect(Collectors.toSet());

            return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), roles));
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Authentication failed.");
        }
    }



    @PostMapping("/auth/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> requestMap) {
        String email = requestMap.get("email");
        User user = userService.findUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        userService.createPasswordResetTokenForUser(user);
        // Ici vous devez implémenter la logique d'envoi de l'email avec le token
        return ResponseEntity.ok("Reset password link sent to: " + email);
    }

    public boolean isTokenExpired(Date expiryDate) {
        LocalDateTime dateToCheck = expiryDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
        return LocalDateTime.now().isAfter(dateToCheck);
    }
    private boolean validateToken(String token, PasswordResetToken storedToken) {
        if (storedToken == null || isTokenExpired(storedToken.getExpiryDate())) {
            return false;
        }
        return token.equals(storedToken.getToken());
    }


    @PostMapping("/auth/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String token,
                                           @RequestParam("newPassword") String newPassword) {
        PasswordResetToken resetToken = userService.getPasswordResetToken(token);
        if (!validateToken(token, resetToken)) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok("Password has been reset successfully");
    }


}

