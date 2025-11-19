package com.example.reservation.service;

import com.example.reservation.entity.Reservation;
import com.example.reservation.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository repository;

    @Autowired
    private MailService mailService; // ← injecter le MailService

    public Reservation createReservation(Reservation reservation) {
        // Sauvegarde la réservation
        Reservation saved = repository.save(reservation);

        // Envoi du mail de confirmation
        mailService.envoyerMail(
                saved.getEmail(), // Assure-toi que Reservation a un champ email
                "Demande de réservation",
                "Bonjour " + saved.getName() + ",\n\n" +
                        "Votre réservation a été enregistrée avec succès !\n" +
                        "Si vous avez un changement à faire veuillez répondre sous ce mail.   \n\n" +
                        "Merci !\n"
        );

        return saved;
    }

    public List<Reservation> getAllReservations() {
        return repository.findAll();
    }

    public Optional<Reservation> updateStatus(Long id, Reservation.Status status) {
        Optional<Reservation> opt = repository.findById(id);
        if (opt.isPresent()) {
            Reservation r = opt.get();
            r.setStatus(status);
            repository.save(r);

            // Optionnel : envoi mail si accepté ou rejeté
            mailService.envoyerMail(
                    r.getEmail(),
                    "Confirmation de réservation",
                    "Bonjour " + r.getName() + ",\n\n" +
                            "Votre demande a été accepté! \n\n" +
                            "Merci et à très vite!"
            );

            return Optional.of(r);
        }
        return Optional.empty();
    }
}
