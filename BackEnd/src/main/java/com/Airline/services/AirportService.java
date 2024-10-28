package com.Airline.services;

import com.Airline.DTO.AirportDto;
import com.Airline.model.Airport;
import com.Airline.repository.AirportRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AirportService {
    private final AirportRepository airportRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public AirportService(AirportRepository airportRepository, ModelMapper modelMapper) {
        this.airportRepository = airportRepository;
        this.modelMapper = modelMapper;
    }

    public List<AirportDto> getAllAirports() {
        return airportRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public AirportDto getAirportById(Long id) {
        Airport airport = airportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airport not found with id: " + id));
        return convertToDto(airport);
    }

    @Transactional
    public AirportDto createAirport(AirportDto airportDto) {
        Airport airport = convertToEntity(airportDto);
        airport = airportRepository.save(airport);
        return convertToDto(airport);
    }

    @Transactional
    public AirportDto updateAirport(Long id, AirportDto airportDto) {
        Airport airport = airportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airport not found with id: " + id));
        updateAirportEntity(airport, airportDto);
        airport = airportRepository.save(airport);
        return convertToDto(airport);
    }

    public void deleteAirport(Long id) {
        if (!airportRepository.existsById(id)) {
            throw new RuntimeException("Airport with id " + id + " does not exist");
        }
        airportRepository.deleteById(id);
    }

    public AirportDto getAirportByName(String name) {
        Airport airport = airportRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Airport with name " + name + " not found"));
        return convertToDto(airport);
    }

    private AirportDto convertToDto(Airport airport) {
        return modelMapper.map(airport, AirportDto.class);
    }

    private Airport convertToEntity(AirportDto airportDto) {
        return modelMapper.map(airportDto, Airport.class);
    }

    private void updateAirportEntity(Airport airport, AirportDto airportDto) {
        airport.setName(airportDto.getName());
        airport.setCode(airportDto.getCode());
        airport.setCity(airportDto.getCity());
        airport.setCountry(airportDto.getCountry());
    }
}
