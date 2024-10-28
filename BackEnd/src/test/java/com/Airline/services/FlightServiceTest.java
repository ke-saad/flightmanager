package com.Airline.services;

import com.Airline.DTO.FlightDto;
import com.Airline.model.Aircraft;
import com.Airline.model.Airport;
import com.Airline.model.Flight;
import com.Airline.repository.AircraftRepository;
import com.Airline.repository.AirportRepository;
import com.Airline.repository.FlightRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class FlightServiceTest {

    @InjectMocks
    private FlightService flightService;

    @Mock
    private FlightRepository flightRepository;

    @Mock
    private AirportRepository airportRepository;

    @Mock
    private AircraftRepository aircraftRepository;

    @Mock
    private ModelMapper modelMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testCreateFlight() {
        FlightDto flightDto = new FlightDto();
        Flight flight = new Flight();

        when(modelMapper.map(flightDto, Flight.class)).thenReturn(flight);
        when(flightRepository.save(flight)).thenReturn(flight);
        when(modelMapper.map(flight, FlightDto.class)).thenReturn(flightDto);

        FlightDto createdFlight = flightService.createFlight(flightDto);

        assertEquals(flightDto, createdFlight);
        verify(flightRepository, times(1)).save(flight);
    }

    @Test
    public void testGetAllFlights() {
        Flight flight1 = new Flight();
        Flight flight2 = new Flight();
        FlightDto flightDto1 = new FlightDto();
        FlightDto flightDto2 = new FlightDto();

        when(flightRepository.findAll()).thenReturn(Arrays.asList(flight1, flight2));
        when(modelMapper.map(flight1, FlightDto.class)).thenReturn(flightDto1);
        when(modelMapper.map(flight2, FlightDto.class)).thenReturn(flightDto2);

        List<FlightDto> flightDtos = flightService.getAllFlights();

        assertEquals(2, flightDtos.size());
        assertEquals(flightDto1, flightDtos.get(0));
        assertEquals(flightDto2, flightDtos.get(1));
    }

    @Test
    public void testGetFlightById() {
        Flight flight = new Flight();
        FlightDto flightDto = new FlightDto();

        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));
        when(modelMapper.map(flight, FlightDto.class)).thenReturn(flightDto);

        FlightDto foundFlight = flightService.getFlightById(1L);

        assertEquals(flightDto, foundFlight);
    }

    @Test
    public void testGetFlightById_NotFound() {
        when(flightRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalStateException.class, () -> {
            flightService.getFlightById(1L);
        });
    }

    @Test
    public void testUpdateFlight() {
        Flight existingFlight = new Flight();
        FlightDto flightDto = new FlightDto();
        flightDto.setAirline("New Airline");
        flightDto.setDepartureTime(LocalDateTime.parse("2023-01-01T10:00:00"));
        flightDto.setArrivalTime(LocalDateTime.parse("2023-01-01T12:00:00"));
        flightDto.setPrice(100.0);

        Airport origin = new Airport();
        origin.setId(1L);
        flightDto.setOriginId(1L);

        Airport destination = new Airport();
        destination.setId(2L);
        flightDto.setDestinationId(2L);

        Aircraft aircraft = new Aircraft();
        aircraft.setId(1L);
        flightDto.setAircraftId(1L);

        when(flightRepository.findById(1L)).thenReturn(Optional.of(existingFlight));
        when(airportRepository.findById(1L)).thenReturn(Optional.of(origin));
        when(airportRepository.findById(2L)).thenReturn(Optional.of(destination));
        when(aircraftRepository.findById(1L)).thenReturn(Optional.of(aircraft));
        when(flightRepository.save(existingFlight)).thenReturn(existingFlight);
        when(modelMapper.map(existingFlight, FlightDto.class)).thenReturn(flightDto);

        FlightDto updatedFlight = flightService.updateFlight(1L, flightDto);

        assertEquals(flightDto, updatedFlight);
        verify(flightRepository, times(1)).save(existingFlight);
    }

    @Test
    public void testDeleteFlight() {
        doNothing().when(flightRepository).deleteById(1L);

        flightService.deleteFlight(1L);

        verify(flightRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testSearchFlightsByOrigin() {
        Flight flight = new Flight();
        FlightDto flightDto = new FlightDto();

        when(flightRepository.findByOriginName("Origin")).thenReturn(Arrays.asList(flight));
        when(modelMapper.map(flight, FlightDto.class)).thenReturn(flightDto);

        List<FlightDto> flightDtos = flightService.searchFlightsByOrigin("Origin");

        assertEquals(1, flightDtos.size());
        assertEquals(flightDto, flightDtos.get(0));
    }

    @Test
    public void testSearchFlightsByDestination() {
        Flight flight = new Flight();
        FlightDto flightDto = new FlightDto();

        when(flightRepository.findByDestinationName("Destination")).thenReturn(Arrays.asList(flight));
        when(modelMapper.map(flight, FlightDto.class)).thenReturn(flightDto);

        List<FlightDto> flightDtos = flightService.searchFlightsByDestination("Destination");

        assertEquals(1, flightDtos.size());
        assertEquals(flightDto, flightDtos.get(0));
    }
}
