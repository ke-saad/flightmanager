package com.Airline.controller;

import com.Airline.DTO.FlightDto;
import com.Airline.services.FlightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @PostMapping
    public ResponseEntity<FlightDto> createFlight(@RequestBody FlightDto flightDto) {
        FlightDto newFlight = flightService.createFlight(flightDto);
        return ResponseEntity.ok(newFlight);
    }
    @GetMapping
    public ResponseEntity<List<FlightDto>> getAllFlights() {
        List<FlightDto> flights = flightService.getAllFlights();
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlightDto> getFlightById(@PathVariable Long id) {
        FlightDto flight = flightService.getFlightById(id);
        return ResponseEntity.ok(flight);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FlightDto> updateFlight(@PathVariable Long id, @RequestBody FlightDto flightDto) {
        FlightDto updatedFlight = flightService.updateFlight(id, flightDto);
        return ResponseEntity.ok(updatedFlight);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/by-origin")
    public ResponseEntity<List<FlightDto>> searchFlightsByOrigin(@RequestParam String origin) {
        List<FlightDto> flights = flightService.searchFlightsByOrigin(origin);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/search/by-destination")
    public ResponseEntity<List<FlightDto>> searchFlightsByDestination(@RequestParam String destination) {
        List<FlightDto> flights = flightService.searchFlightsByDestination(destination);
        return ResponseEntity.ok(flights);
    }
}
