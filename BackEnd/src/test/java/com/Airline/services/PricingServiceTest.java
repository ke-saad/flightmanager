package com.Airline.services;

import com.Airline.enums.SeatClass;
import com.Airline.model.Flight;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;


public class PricingServiceTest {

    private PricingService pricingService;

    @BeforeEach
    public void setUp() {
        pricingService = new PricingService();
    }

    @Test
    public void testCalculateTotalPrice_EconomyClass_NoExtraBags() {
        Flight flight = new Flight();
        flight.setPrice(100.0);

        double totalPrice = pricingService.calculateTotalPrice(flight, SeatClass.ECONOMY, 0, 1);

        assertEquals(100.0, totalPrice);
    }

    @Test
    public void testCalculateTotalPrice_BusinessClass_NoExtraBags() {
        Flight flight = new Flight();
        flight.setPrice(100.0);

        double totalPrice = pricingService.calculateTotalPrice(flight, SeatClass.BUSINESS, 0, 1);

        assertEquals(150.0, totalPrice); // 100 + 50% of 100
    }

    @Test
    public void testCalculateTotalPrice_FirstClass_NoExtraBags() {
        Flight flight = new Flight();
        flight.setPrice(100.0);

        double totalPrice = pricingService.calculateTotalPrice(flight, SeatClass.FIRST_CLASS, 0, 1);

        assertEquals(200.0, totalPrice); // 100 + 100% of 100
    }

    @Test
    public void testCalculateTotalPrice_EconomyClass_WithExtraBags() {
        Flight flight = new Flight();
        flight.setPrice(100.0);

        double totalPrice = pricingService.calculateTotalPrice(flight, SeatClass.ECONOMY, 2, 1);

        assertEquals(150.0, totalPrice); // 100 + 2*25
    }

    @Test
    public void testCalculateTotalPrice_BusinessClass_WithExtraBags() {
        Flight flight = new Flight();
        flight.setPrice(100.0);

        double totalPrice = pricingService.calculateTotalPrice(flight, SeatClass.BUSINESS, 2, 1);

        assertEquals(200.0, totalPrice); // 100 + 50 + 2*25
    }

    @Test
    public void testCalculateTotalPrice_FirstClass_WithExtraBags() {
        Flight flight = new Flight();
        flight.setPrice(100.0);

        double totalPrice = pricingService.calculateTotalPrice(flight, SeatClass.FIRST_CLASS, 2, 1);

        assertEquals(250.0, totalPrice); // 100 + 100 + 2*25
    }

    @Test
    public void testCalculateTotalPrice_MultiplePassengers() {
        Flight flight = new Flight();
        flight.setPrice(100.0);

        double totalPrice = pricingService.calculateTotalPrice(flight, SeatClass.ECONOMY, 1, 3);

        assertEquals(325.0, totalPrice); // 100*3 + 25
    }
}
