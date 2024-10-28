package com.Airline.services;

import com.Airline.enums.Role;
import com.Airline.model.PasswordResetToken;
import com.Airline.model.User;
import com.Airline.repository.PasswordResetTokenRepository;
import com.Airline.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private EmailService emailService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testFindUserByEmail() {
        User user = new User();
        user.setEmail("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        Optional<User> foundUser = userService.findUserByEmail("test@example.com");

        assertTrue(foundUser.isPresent());
        assertEquals("test@example.com", foundUser.get().getEmail());
    }

    @Test
    public void testFindAllUsers() {
        User user1 = new User();
        user1.setEmail("user1@example.com");
        User user2 = new User();
        user2.setEmail("user2@example.com");

        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        List<User> users = userService.findAllUsers();

        assertEquals(2, users.size());
    }

    @Test
    public void testUpdateUser() {
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setEmail("existing@example.com");

        User userDetails = new User();
        userDetails.setFirstName("NewFirstName");
        userDetails.setLastName("NewLastName");
        userDetails.setUsername("NewUsername");
        userDetails.setEmail("new@example.com");
        userDetails.setPassword("newpassword");
        userDetails.setRoles(new HashSet<>(Arrays.asList(Role.ROLE_USER))); // Utilisation de Set<Role>

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.encode("newpassword")).thenReturn("encodedpassword");
        when(userRepository.save(existingUser)).thenReturn(existingUser);

        User updatedUser = userService.updateUser(1L, userDetails);

        assertEquals("NewFirstName", updatedUser.getFirstName());
        assertEquals("NewLastName", updatedUser.getLastName());
        assertEquals("NewUsername", updatedUser.getUsername());
        assertEquals("new@example.com", updatedUser.getEmail());
        assertEquals("encodedpassword", updatedUser.getPassword());
        assertEquals(new HashSet<>(Arrays.asList(Role.ROLE_USER)), updatedUser.getRoles()); // Utilisation de Set<Role>
    }

    @Test
    public void testDeleteUser() {
        doNothing().when(userRepository).deleteById(1L);

        userService.deleteUser(1L);

        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testCreatePasswordResetTokenForUser() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);

        when(passwordResetTokenRepository.findByUserId(1L)).thenReturn(null);
        when(passwordResetTokenRepository.save(any(PasswordResetToken.class))).thenReturn(token);

        userService.createPasswordResetTokenForUser(user);

        verify(passwordResetTokenRepository, times(1)).save(any(PasswordResetToken.class));
        verify(emailService, times(1)).sendPasswordResetEmail(eq("test@example.com"), anyString());
    }

    @Test
    public void testValidatePasswordResetToken() {
        PasswordResetToken token = new PasswordResetToken();
        token.setExpiryDate(new Date(System.currentTimeMillis() + 600000));

        when(passwordResetTokenRepository.findByToken("valid-token")).thenReturn(token);

        boolean isValid = userService.validatePasswordResetToken("valid-token");

        assertTrue(isValid);
    }

    @Test
    public void testValidatePasswordResetTokenExpired() {
        PasswordResetToken token = new PasswordResetToken();
        token.setExpiryDate(new Date(System.currentTimeMillis() - 600000));

        when(passwordResetTokenRepository.findByToken("expired-token")).thenReturn(token);

        boolean isValid = userService.validatePasswordResetToken("expired-token");

        assertFalse(isValid);
    }

    @Test
    public void testChangeUserPassword() {
        User user = new User();
        user.setPassword("oldpassword");

        when(passwordEncoder.encode("newpassword")).thenReturn("encodednewpassword");
        when(userRepository.save(user)).thenReturn(user);

        boolean result = userService.changeUserPassword(user, "newpassword");

        assertTrue(result);
        assertEquals("encodednewpassword", user.getPassword());
    }
}
