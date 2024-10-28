package com.Airline.DTO;

import com.Airline.enums.SeatClass;
import lombok.Getter;
import lombok.Setter;

import java.util.Date; // Importez la classe Date

@Getter
@Setter
public class BookingDto {
    private Long id;
    private Long userId;
    private Long flightId;
    private SeatClass seatClass;
    private String seatNumber;
    private int extraBags;
    private int passengerCount;
    private double totalPrice;
    private boolean isCheckedIn;
    private Date reservationDate;
}
