package com.Airline.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailUtil implements EmailService {

    private final JavaMailSender emailSender;

    @Autowired
    public EmailUtil(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Override
    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    @Override
    public void sendPasswordResetEmail(String to, String token) {
        String resetUrl = "http://localhost:5173/auth/resetpassword?token=" + token;
        String subject = "Réinitialisation de votre mot de passe";
        String text = "Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : " + resetUrl;

        sendSimpleMessage(to, subject, text);
    }
}
