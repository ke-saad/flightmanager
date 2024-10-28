package com.Airline.repository;

import com.Airline.model.PasswordResetToken;
import com.Airline.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String token);
    PasswordResetToken findByUser(User user);

    PasswordResetToken findByUserId(Long id);
}
