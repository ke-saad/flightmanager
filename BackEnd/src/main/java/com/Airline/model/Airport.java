package com.Airline.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "airports", indexes = {
        @Index(name = "idx_airport_city", columnList = "city"),
        @Index(name = "idx_airport_country", columnList = "country")
})
public class Airport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "code", nullable = false, unique = true, length = 3)
    private String code; // IATA code

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "country", nullable = false)
    private String country;

    @OneToMany(mappedBy = "origin", fetch = FetchType.LAZY)
    private Set<Flight> departures = new HashSet<>();

    @OneToMany(mappedBy = "destination", fetch = FetchType.LAZY)
    private Set<Flight> arrivals = new HashSet<>();

}
