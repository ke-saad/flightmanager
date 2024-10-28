package com.Airline.controller;

import com.Airline.DTO.AirportDto;
import com.Airline.services.AirportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
public class AirportController {
    private final AirportService airportService;

    @Autowired
    public AirportController(AirportService airportService) {
        this.airportService = airportService;
    }

    @GetMapping
    public ResponseEntity<List<AirportDto>> getAllAirports() {
        List<AirportDto> airports = airportService.getAllAirports();
        return ResponseEntity.ok(airports);
    }


    @GetMapping("/{id}")
    public ResponseEntity<AirportDto> getAirportById(@PathVariable Long id) {
        AirportDto airport = airportService.getAirportById(id);
        return ResponseEntity.ok(airport);
    }

    @PostMapping
    public ResponseEntity<AirportDto> createAirport(@RequestBody AirportDto airportDto) {
        AirportDto newAirport = airportService.createAirport(airportDto);
        return ResponseEntity.ok(newAirport);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AirportDto> updateAirport(@PathVariable Long id, @RequestBody AirportDto airportDto) {
        AirportDto updatedAirport = airportService.updateAirport(id, airportDto);
        return ResponseEntity.ok(updatedAirport);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAirport(@PathVariable Long id) {
        airportService.deleteAirport(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<AirportDto> getAirportByName(@RequestParam String name) {
        AirportDto airport = airportService.getAirportByName(name);
        return ResponseEntity.ok(airport);
    }
}
