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

            // === ENVOI MAIL UNIQUEMENT SI ACCEPTÉE ===
            if (status == Reservation.Status.ACCEPTED) {  // ou .CONFIRMED selon ton enum

                // On récupère les infos utiles depuis le commentaire (comme dans le front)
                int personnes = 1;
                int valises = 0;
                int prixTotal = 20;

                if (r.getComment() != null) {
                    personnes = extractInt(r.getComment(), "Nombre de personnes");
                    valises = extractInt(r.getComment(), "Valises");
                    prixTotal = personnes * 20;
                }

                String trajet = (r.getComment() != null &&
                        (r.getComment().toLowerCase().contains("zaventem") ||
                                r.getComment().toLowerCase().contains("aéroport")))
                        ? "Aéroport de Zaventem → Jette" : "Jette → Aéroport de Zaventem";

                String messageConfirme = "Bonjour " + r.getName() + ",\n\n" +
                        "Super nouvelle : votre course est CONFIRMÉE !\n\n" +
                        "══════════════════════════════════\n" +
                        "       CONFIRMATION DE COURSE\n" +
                        "══════════════════════════════════\n" +
                        "Trajet          : " + trajet + "\n" +
                        "Date            : " + r.getDate() + "\n" +
                        "Heure           : " + r.getTime() + "\n" +
                        "Personnes       : " + personnes + "\n" +
                        "Valises         : " + valises + "\n" +
                        "Prix total      : " + prixTotal + " € (payable sur place)\n" +
                        "══════════════════════════════════\n\n" +
                        "Je passe vous chercher à l’heure exacte !\n" +
                        "En cas de retard de vol ou changement, appelez-moi :\n\n" +
                        "0467 01 70 68\n\n" +
                        "Merci pour votre confiance !\n" +
                        "À très vite sur la route,\n\n" +
                        "Votre jeune étudiant à votre service ;) –  Jette ↔ Zaventem";

                mailService.envoyerMail(
                        r.getEmail(),
                        "Course CONFIRMÉE – Taxi Jette ↔ Zaventem",
                        messageConfirme
                );

            } else if (status == Reservation.Status.REJECTED) {
                // Optionnel : mail poli si refus
                mailService.envoyerMail(
                        r.getEmail(),
                        "Indisponibilité – Taxi Jette ↔ Zaventem",
                        "Bonjour " + r.getName() + ",\n\n" +
                                "Je suis vraiment désolé, je ne suis pas disponible à cet horaire.\n\n" +
                                "N’hésitez pas à proposer une autre heure, je ferai mon maximum !\n\n" +
                                "Merci pour votre compréhension,\n" +
                                "À très vite j’espère !\n\n" +
                                "0467 01 70 68"
                );
            }

            return Optional.of(r);
        }
        return Optional.empty();
    }
    private int extractInt(String text, String keyword) {
        if (text == null) {
            return keyword.toLowerCase().contains("personnes") ? 1 : 0;
        }
        java.util.regex.Matcher matcher = java.util.regex.Pattern
                .compile(keyword + "[:\\s]*(\\d+)", java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(text);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return keyword.toLowerCase().contains("personnes") ? 1 : 0;
    }
}
