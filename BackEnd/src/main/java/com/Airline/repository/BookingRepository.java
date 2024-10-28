package com.Airline.repository;

import com.Airline.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Vous pouvez ajouter ici des méthodes de requête personnalisées si nécessaire
}
