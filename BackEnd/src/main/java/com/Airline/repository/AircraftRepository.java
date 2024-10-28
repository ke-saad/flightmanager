package com.Airline.repository;

import com.Airline.model.Aircraft;
import com.Airline.enums.AircraftStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AircraftRepository extends JpaRepository<Aircraft, Long> {
    List<Aircraft> findByStatus(AircraftStatus status);
    List<Aircraft> findByModelContainingIgnoreCase(String model);

}
