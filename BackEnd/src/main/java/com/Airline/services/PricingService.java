package com.Airline.services;

import com.Airline.model.Booking;
import com.Airline.model.Flight;
import com.Airline.enums.SeatClass;
import org.springframework.stereotype.Service;

@Service
public class PricingService {

    public double calculateTotalPrice(Flight flight, SeatClass seatClass, int extraBags, int passengerCount) {
        double basePrice = flight.getPrice();
        double totalPrice = basePrice * passengerCount; // Prix de base multiplié par le nombre de passagers

        // Ajout des coûts selon la classe de siège
        switch (seatClass) {
            case BUSINESS:
                totalPrice += (basePrice * 0.5) * passengerCount;
                break;
            case FIRST_CLASS:
                totalPrice += basePrice * passengerCount;
                break;
            default:
                break;
        }

        // Coût pour les bagages supplémentaires
        totalPrice += extraBags * 25; // Supposons que chaque bagage supplémentaire coûte 25

        return totalPrice;
    }
}
