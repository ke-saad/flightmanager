package com.Airline.controller;

import com.Airline.DTO.AircraftDto;
import com.Airline.DTO.FlightDto;
import com.Airline.enums.AircraftStatus;
import com.Airline.services.AircraftService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aircraft")
public class AircraftController {

    private static final Logger logger = LoggerFactory.getLogger(AircraftController.class);
    private final AircraftService aircraftService;

    @Autowired
    public AircraftController(AircraftService aircraftService) {
        this.aircraftService = aircraftService;
    }

    @GetMapping
    public ResponseEntity<List<AircraftDto>> getAllAircrafts() {
        logger.debug("Fetching all aircrafts");
        List<AircraftDto> aircrafts = aircraftService.findAllAircrafts();
        return ResponseEntity.ok(aircrafts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AircraftDto> getAircraftById(@PathVariable Long id) {
        logger.debug("Fetching aircraft by ID: {}", id);
        AircraftDto aircraft = aircraftService.findAircraftById(id);
        return ResponseEntity.ok(aircraft);
    }

    @PostMapping
    public ResponseEntity<AircraftDto> createAircraft(@RequestBody AircraftDto aircraftDto) {
        logger.debug("Creating aircraft: {}", aircraftDto);
        AircraftDto savedAircraft = aircraftService.saveAircraft(aircraftDto);
        return ResponseEntity.ok(savedAircraft);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AircraftDto> updateAircraft(@PathVariable Long id, @RequestBody AircraftDto aircraftDto) {
        logger.debug("Updating aircraft ID: {}, Details: {}", id, aircraftDto);
        AircraftDto updatedAircraft = aircraftService.updateAircraft(id, aircraftDto);
        return ResponseEntity.ok(updatedAircraft);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAircraft(@PathVariable Long id) {
        logger.debug("Deleting aircraft ID: {}", id);
        aircraftService.deleteAircraft(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AircraftDto>> getAircraftsByStatus(@PathVariable AircraftStatus status) {
        logger.debug("Fetching aircrafts by status: {}", status);
        List<AircraftDto> aircrafts = aircraftService.getAircraftsByStatus(status);
        return ResponseEntity.ok(aircrafts);
    }

    @GetMapping("/search")
    public ResponseEntity<List<AircraftDto>> getAircraftsByModel(@RequestParam String model) {
        logger.debug("Searching aircrafts by model: {}", model);
        List<AircraftDto> aircrafts = aircraftService.findAircraftsByModel(model);
        return ResponseEntity.ok(aircrafts);
    }


}
