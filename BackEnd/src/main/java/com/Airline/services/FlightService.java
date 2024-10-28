package com.Airline.services;

import com.Airline.DTO.FlightDto;
import com.Airline.model.Aircraft;
import com.Airline.model.Airport;
import com.Airline.model.Flight;
import com.Airline.repository.AircraftRepository;
import com.Airline.repository.AirportRepository;
import com.Airline.repository.FlightRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlightService {

    private final FlightRepository flightRepository;
    private final AirportRepository airportRepository;
    private final AircraftRepository aircraftRepository;
    private final ModelMapper modelMapper;

    public FlightService(FlightRepository flightRepository, AirportRepository airportRepository,
                         AircraftRepository aircraftRepository, ModelMapper modelMapper) {
        this.flightRepository = flightRepository;
        this.airportRepository = airportRepository;
        this.aircraftRepository = aircraftRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public FlightDto createFlight(FlightDto flightDto) {
        Flight flight = modelMapper.map(flightDto, Flight.class);
        flight = flightRepository.save(flight);
        return modelMapper.map(flight, FlightDto.class);
    }

    public List<FlightDto> getAllFlights() {
        List<Flight> flights = flightRepository.findAll(); // Ensure this fetches everything
        return flights.stream()
                .map(flight -> modelMapper.map(flight, FlightDto.class))
                .collect(Collectors.toList());
    }

    public FlightDto getFlightById(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Flight not found with id: " + id));
        return modelMapper.map(flight, FlightDto.class);
    }

    @Transactional
    public FlightDto updateFlight(Long id, FlightDto flightDto) {
        Flight existingFlight = flightRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Flight not found with id: " + id));

        // Update mutable fields
        existingFlight.setAirline(flightDto.getAirline());
        existingFlight.setDepartureTime(flightDto.getDepartureTime());
        existingFlight.setArrivalTime(flightDto.getArrivalTime());
        existingFlight.setPrice(flightDto.getPrice());

        // Update related entities based on provided IDs
        if (flightDto.getOriginId() != null) {
            Airport origin = airportRepository.findById(flightDto.getOriginId())
                    .orElseThrow(() -> new IllegalStateException("Origin airport not found"));
            existingFlight.setOrigin(origin);
        }
        if (flightDto.getDestinationId() != null) {
            Airport destination = airportRepository.findById(flightDto.getDestinationId())
                    .orElseThrow(() -> new IllegalStateException("Destination airport not found"));
            existingFlight.setDestination(destination);
        }
        if (flightDto.getAircraftId() != null) {
            Aircraft aircraft = aircraftRepository.findById(flightDto.getAircraftId())
                    .orElseThrow(() -> new IllegalStateException("Aircraft not found"));
            existingFlight.setAircraft(aircraft);
        }

        existingFlight = flightRepository.save(existingFlight);
        return modelMapper.map(existingFlight, FlightDto.class);
    }

    @Transactional
    public void deleteFlight(Long id) {
        flightRepository.deleteById(id);
    }

    public List<FlightDto> searchFlightsByOrigin(String originName) {
        return flightRepository.findByOriginName(originName).stream()
                .map(flight -> modelMapper.map(flight, FlightDto.class))
                .collect(Collectors.toList());
    }

    public List<FlightDto> searchFlightsByDestination(String destinationName) {
        return flightRepository.findByDestinationName(destinationName).stream()
                .map(flight -> modelMapper.map(flight, FlightDto.class))
                .collect(Collectors.toList());
    }

}
