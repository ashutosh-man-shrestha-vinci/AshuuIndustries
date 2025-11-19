package com.example.reservation.controller;

import com.example.reservation.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MailController {

    @Autowired
    private MailService mailService;

    @GetMapping("/envoyerMailTest")
    public String envoyerMailTest() {
        mailService.envoyerMail(
                "ashutosh.manshrestha@student.vinci.be",
                "Test Mailtrap Sandbox",
                "Ceci est un mail de test via Mailtrap Sandbox SMTP"
        );
        return "Mail envoyé !";
    }
}
