package com.Airline.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class EmailUtilTest {

    @InjectMocks
    private EmailUtil emailUtil;

    @Mock
    private JavaMailSender emailSender;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testSendSimpleMessage() {
        String to = "test@example.com";
        String subject = "Test Subject";
        String text = "Test Text";

        emailUtil.sendSimpleMessage(to, subject, text);

        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    public void testSendPasswordResetEmail() {
        String to = "test@example.com";
        String token = "dummy-token";
        String expectedSubject = "Réinitialisation de votre mot de passe";
        String expectedText = "Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : http://localhost:5173/auth/resetpassword?token=dummy-token";

        emailUtil.sendPasswordResetEmail(to, token);

        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}
