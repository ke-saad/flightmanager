package com.Airline.model;

import jakarta.persistence.*;
import com.Airline.enums.SeatClass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date; // Importez la classe Date

@Entity
@Table(name = "booking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_class")
    private SeatClass seatClass;

    @Column(name = "seat_number", nullable = true)  // Modified to allow seat selection
    private String seatNumber;

    @Column(name = "extra_bags")
    private int extraBags;

    @Column(name = "passenger_count")
    private int passengerCount;

    @Column(name = "total_price")
    private double totalPrice;

    @Column(name = "is_checked_in", columnDefinition = "boolean default false")
    private boolean isCheckedIn;

    @Temporal(TemporalType.TIMESTAMP) // Spécifiez le type de temporel pour la date de réservation
    @Column(name = "reservation_date")
    private Date reservationDate; // Ajoutez le champ de date de réservation
}
