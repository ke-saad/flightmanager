package com.Airline.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FlightDto {
    private Long id;
    private String airline;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Double price;
    private Long originId;
    private Long destinationId;
    private Long aircraftId;

    // Getters and setters for all fields, including getAircraftModel and setAircraftModel
}
