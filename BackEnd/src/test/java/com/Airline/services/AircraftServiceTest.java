package com.Airline.services;

import com.Airline.DTO.AircraftDto;
import com.Airline.enums.AircraftStatus;
import com.Airline.model.Aircraft;
import com.Airline.repository.AircraftRepository;
import com.Airline.services.AircraftService;
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


public class AircraftServiceTest {

    @InjectMocks
    private AircraftService aircraftService;

    @Mock
    private AircraftRepository aircraftRepository;

    @Mock
    private ModelMapper modelMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testFindAllAircrafts() {
        Aircraft aircraft1 = new Aircraft();
        Aircraft aircraft2 = new Aircraft();
        AircraftDto aircraftDto1 = new AircraftDto();
        AircraftDto aircraftDto2 = new AircraftDto();

        when(aircraftRepository.findAll()).thenReturn(Arrays.asList(aircraft1, aircraft2));
        when(modelMapper.map(aircraft1, AircraftDto.class)).thenReturn(aircraftDto1);
        when(modelMapper.map(aircraft2, AircraftDto.class)).thenReturn(aircraftDto2);

        List<AircraftDto> aircraftDtos = aircraftService.findAllAircrafts();

        assertEquals(2, aircraftDtos.size());
        assertEquals(aircraftDto1, aircraftDtos.get(0));
        assertEquals(aircraftDto2, aircraftDtos.get(1));
    }

    @Test
    public void testFindAircraftById() {
        Aircraft aircraft = new Aircraft();
        AircraftDto aircraftDto = new AircraftDto();

        when(aircraftRepository.findById(1L)).thenReturn(Optional.of(aircraft));
        when(modelMapper.map(aircraft, AircraftDto.class)).thenReturn(aircraftDto);

        AircraftDto foundAircraft = aircraftService.findAircraftById(1L);

        assertEquals(aircraftDto, foundAircraft);
    }

    @Test
    public void testFindAircraftById_NotFound() {
        when(aircraftRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            aircraftService.findAircraftById(1L);
        });
    }

    @Test
    public void testSaveAircraft() {
        AircraftDto aircraftDto = new AircraftDto();
        Aircraft aircraft = new Aircraft();

        when(modelMapper.map(aircraftDto, Aircraft.class)).thenReturn(aircraft);
        when(aircraftRepository.save(aircraft)).thenReturn(aircraft);
        when(modelMapper.map(aircraft, AircraftDto.class)).thenReturn(aircraftDto);

        AircraftDto savedAircraft = aircraftService.saveAircraft(aircraftDto);

        assertEquals(aircraftDto, savedAircraft);
        verify(aircraftRepository, times(1)).save(aircraft);
    }

    @Test
    public void testUpdateAircraft() {
        Aircraft existingAircraft = new Aircraft();
        AircraftDto aircraftDto = new AircraftDto();
        aircraftDto.setModel("New Model");
        aircraftDto.setRegistrationNumber("New Reg");
        aircraftDto.setSeatingCapacity(150);
        aircraftDto.setStatus(AircraftStatus.ACTIVE);

        when(aircraftRepository.findById(1L)).thenReturn(Optional.of(existingAircraft));
        when(aircraftRepository.save(existingAircraft)).thenReturn(existingAircraft);
        when(modelMapper.map(existingAircraft, AircraftDto.class)).thenReturn(aircraftDto);

        AircraftDto updatedAircraft = aircraftService.updateAircraft(1L, aircraftDto);

        assertEquals(aircraftDto, updatedAircraft);
        verify(aircraftRepository, times(1)).save(existingAircraft);
    }

    @Test
    public void testDeleteAircraft() {
        doNothing().when(aircraftRepository).deleteById(1L);

        aircraftService.deleteAircraft(1L);

        verify(aircraftRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testGetAircraftsByStatus() {
        Aircraft aircraft = new Aircraft();
        AircraftDto aircraftDto = new AircraftDto();

        when(aircraftRepository.findByStatus(AircraftStatus.ACTIVE)).thenReturn(Arrays.asList(aircraft));
        when(modelMapper.map(aircraft, AircraftDto.class)).thenReturn(aircraftDto);

        List<AircraftDto> aircraftDtos = aircraftService.getAircraftsByStatus(AircraftStatus.ACTIVE);

        assertEquals(1, aircraftDtos.size());
        assertEquals(aircraftDto, aircraftDtos.get(0));
    }

    @Test
    public void testFindAircraftsByModel() {
        Aircraft aircraft = new Aircraft();
        AircraftDto aircraftDto = new AircraftDto();

        when(aircraftRepository.findByModelContainingIgnoreCase("Boeing")).thenReturn(Arrays.asList(aircraft));
        when(modelMapper.map(aircraft, AircraftDto.class)).thenReturn(aircraftDto);

        List<AircraftDto> aircraftDtos = aircraftService.findAircraftsByModel("Boeing");

        assertEquals(1, aircraftDtos.size());
        assertEquals(aircraftDto, aircraftDtos.get(0));
    }
}
