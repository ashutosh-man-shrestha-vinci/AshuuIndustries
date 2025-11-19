package com.example.reservation.controller;

import com.example.reservation.entity.Reservation;
import com.example.reservation.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000") // pour React
public class ReservationController {

    @Autowired
    private ReservationService service;

    @PostMapping
    public Reservation create(@RequestBody Reservation reservation) {
        return service.createReservation(reservation);
    }

    @GetMapping
    public List<Reservation> all() {
        return service.getAllReservations();
    }

    @PutMapping("/{id}/accept")
    public Reservation accept(@PathVariable Long id) {
        return service.updateStatus(id, Reservation.Status.ACCEPTED).orElse(null);
    }

    @PutMapping("/{id}/reject")
    public Reservation reject(@PathVariable Long id) {
        return service.updateStatus(id, Reservation.Status.REJECTED).orElse(null);
    }
}
