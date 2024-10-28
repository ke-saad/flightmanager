package com.Airline.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AirportDto {
    private Long id;
    private String name;
    private String code;
    private String city;
    private String country;
}
