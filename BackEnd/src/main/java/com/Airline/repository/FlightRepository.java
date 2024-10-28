package com.Airline.repository;

import com.Airline.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, Long> {
    List<Flight> findByOriginName(String name);
    List<Flight> findByDestinationName(String name);
    List<Flight> findByAircraftIdIsNull();


}
