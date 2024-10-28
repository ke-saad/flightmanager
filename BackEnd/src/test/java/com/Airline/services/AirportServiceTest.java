package com.Airline.services;

import com.Airline.DTO.AirportDto;
import com.Airline.model.Airport;
import com.Airline.repository.AirportRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;


public class AirportServiceTest {

    @InjectMocks
    private AirportService airportService;

    @Mock
    private AirportRepository airportRepository;

    @Mock
    private ModelMapper modelMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAllAirports() {
        Airport airport1 = new Airport();
        Airport airport2 = new Airport();
        AirportDto airportDto1 = new AirportDto();
        AirportDto airportDto2 = new AirportDto();

        when(airportRepository.findAll()).thenReturn(Arrays.asList(airport1, airport2));
        when(modelMapper.map(airport1, AirportDto.class)).thenReturn(airportDto1);
        when(modelMapper.map(airport2, AirportDto.class)).thenReturn(airportDto2);

        List<AirportDto> airportDtos = airportService.getAllAirports();

        assertEquals(2, airportDtos.size());
        assertEquals(airportDto1, airportDtos.get(0));
        assertEquals(airportDto2, airportDtos.get(1));
    }

    @Test
    public void testGetAirportById() {
        Airport airport = new Airport();
        AirportDto airportDto = new AirportDto();

        when(airportRepository.findById(1L)).thenReturn(Optional.of(airport));
        when(modelMapper.map(airport, AirportDto.class)).thenReturn(airportDto);

        AirportDto foundAirport = airportService.getAirportById(1L);

        assertEquals(airportDto, foundAirport);
    }

    @Test
    public void testGetAirportById_NotFound() {
        when(airportRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            airportService.getAirportById(1L);
        });
    }

    @Test
    public void testCreateAirport() {
        AirportDto airportDto = new AirportDto();
        Airport airport = new Airport();

        when(modelMapper.map(airportDto, Airport.class)).thenReturn(airport);
        when(airportRepository.save(airport)).thenReturn(airport);
        when(modelMapper.map(airport, AirportDto.class)).thenReturn(airportDto);

        AirportDto createdAirport = airportService.createAirport(airportDto);

        assertEquals(airportDto, createdAirport);
        verify(airportRepository, times(1)).save(airport);
    }

    @Test
    public void testUpdateAirport() {
        Airport existingAirport = new Airport();
        AirportDto airportDto = new AirportDto();
        airportDto.setName("New Name");
        airportDto.setCode("New Code");
        airportDto.setCity("New City");
        airportDto.setCountry("New Country");

        when(airportRepository.findById(1L)).thenReturn(Optional.of(existingAirport));
        when(airportRepository.save(existingAirport)).thenReturn(existingAirport);
        when(modelMapper.map(existingAirport, AirportDto.class)).thenReturn(airportDto);

        AirportDto updatedAirport = airportService.updateAirport(1L, airportDto);

        assertEquals(airportDto, updatedAirport);
        verify(airportRepository, times(1)).save(existingAirport);
    }

    @Test
    public void testDeleteAirport() {
        when(airportRepository.existsById(1L)).thenReturn(true);
        doNothing().when(airportRepository).deleteById(1L);

        airportService.deleteAirport(1L);

        verify(airportRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testDeleteAirport_NotFound() {
        when(airportRepository.existsById(1L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> {
            airportService.deleteAirport(1L);
        });
    }

    @Test
    public void testGetAirportByName() {
        Airport airport = new Airport();
        AirportDto airportDto = new AirportDto();

        when(airportRepository.findByName("Test Airport")).thenReturn(Optional.of(airport));
        when(modelMapper.map(airport, AirportDto.class)).thenReturn(airportDto);

        AirportDto foundAirport = airportService.getAirportByName("Test Airport");

        assertEquals(airportDto, foundAirport);
    }

    @Test
    public void testGetAirportByName_NotFound() {
        when(airportRepository.findByName("Test Airport")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            airportService.getAirportByName("Test Airport");
        });
    }
}
