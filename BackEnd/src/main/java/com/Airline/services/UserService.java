package com.Airline.services;

import com.Airline.model.PasswordResetToken;
import com.Airline.model.User;
import com.Airline.repository.PasswordResetTokenRepository;
import com.Airline.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, PasswordResetTokenRepository passwordResetTokenRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }


    public User updateUser(Long id, User userDetails) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setFirstName(userDetails.getFirstName()); // Mise à jour du prénom
        existingUser.setLastName(userDetails.getLastName()); // Mise à jour du nom de famille
        existingUser.setUsername(userDetails.getUsername());
        existingUser.setEmail(userDetails.getEmail());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        existingUser.setRoles(userDetails.getRoles());
        return userRepository.save(existingUser);
    }


    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void createPasswordResetTokenForUser(User user) {
        // Check for an existing token
        PasswordResetToken existingToken = passwordResetTokenRepository.findByUserId(user.getId());
        String token = UUID.randomUUID().toString();
        Date expiryDate = new Date(System.currentTimeMillis() + 600000); // 10 minutes

        if (existingToken != null) {
            // Update the existing token
            existingToken.setToken(token);
            existingToken.setExpiryDate(expiryDate);
        } else {
            // Or create a new token if one doesn't exist
            existingToken = new PasswordResetToken(token, user, expiryDate);
        }

        passwordResetTokenRepository.save(existingToken);
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    public boolean validatePasswordResetToken(String token) {
        PasswordResetToken passToken = passwordResetTokenRepository.findByToken(token);
        return passToken != null && !passToken.getExpiryDate().before(new Date());
    }

    public PasswordResetToken getPasswordResetToken(String token) {
        return passwordResetTokenRepository.findByToken(token);
    }

    public boolean isTokenExpired(PasswordResetToken token) {
        return token.getExpiryDate().before(new Date());
    }

    public boolean changeUserPassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

}