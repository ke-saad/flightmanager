package com.Airline.services;

import com.Airline.DTO.AircraftDto;
import com.Airline.enums.AircraftStatus;
import com.Airline.model.Aircraft;
import com.Airline.repository.AircraftRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AircraftService {

    private final AircraftRepository aircraftRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public AircraftService(AircraftRepository aircraftRepository, ModelMapper modelMapper) {
        this.aircraftRepository = aircraftRepository;
        this.modelMapper = modelMapper;
    }

    public List<AircraftDto> findAllAircrafts() {
        return aircraftRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public AircraftDto findAircraftById(Long id) {
        Aircraft aircraft = aircraftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aircraft not found with id: " + id));
        return convertToDto(aircraft);
    }

    @Transactional
    public AircraftDto saveAircraft(AircraftDto aircraftDto) {
        Aircraft aircraft = convertToEntity(aircraftDto);
        aircraft = aircraftRepository.save(aircraft);
        return convertToDto(aircraft);
    }

    @Transactional
    public AircraftDto updateAircraft(Long id, AircraftDto aircraftDto) {
        Aircraft aircraft = aircraftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aircraft not found with id: " + id));
        updateAircraftEntity(aircraft, aircraftDto);
        aircraft = aircraftRepository.save(aircraft);
        return convertToDto(aircraft);
    }

    public void deleteAircraft(Long id) {
        aircraftRepository.deleteById(id);
    }

    public List<AircraftDto> getAircraftsByStatus(AircraftStatus status) {
        return aircraftRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<AircraftDto> findAircraftsByModel(String model) {
        return aircraftRepository.findByModelContainingIgnoreCase(model).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private AircraftDto convertToDto(Aircraft aircraft) {
        return modelMapper.map(aircraft, AircraftDto.class);
    }

    private Aircraft convertToEntity(AircraftDto aircraftDto) {
        return modelMapper.map(aircraftDto, Aircraft.class);
    }

    private void updateAircraftEntity(Aircraft aircraft, AircraftDto aircraftDto) {
        aircraft.setModel(aircraftDto.getModel());
        aircraft.setRegistrationNumber(aircraftDto.getRegistrationNumber());
        aircraft.setSeatingCapacity(aircraftDto.getSeatingCapacity());
        aircraft.setStatus(aircraftDto.getStatus());
    }
}
