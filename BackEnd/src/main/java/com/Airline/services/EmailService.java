package com.Airline.services;

public interface EmailService {
    void sendSimpleMessage(String to, String subject, String text);
    void sendPasswordResetEmail(String to, String token);
}