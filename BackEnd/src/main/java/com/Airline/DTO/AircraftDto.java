package com.Airline.DTO;

import com.Airline.enums.AircraftStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AircraftDto {
    private Long id;
    private String model;
    private String registrationNumber;
    private int seatingCapacity;
    private AircraftStatus status;
    private List<FlightDto> assignedFlights; // Add this to include assigned flights in the DTO
}
