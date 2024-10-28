package com.Airline.model;

import com.Airline.enums.AircraftStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Aircraft {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String registrationNumber; // Identifiant unique pour chaque avion
    private String model;
    private int seatingCapacity;

    @Enumerated(EnumType.STRING)
    private AircraftStatus status; // Utilisation de l'énumération pour le statut

    @OneToMany(mappedBy = "aircraft", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Flight> assignedFlights; // Vols assignés à cet avion
}
