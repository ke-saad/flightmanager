package com.Airline.services;

import com.Airline.DTO.BookingDto;
import com.Airline.model.Booking;
import com.Airline.model.Flight;
import com.Airline.model.User;
import com.Airline.repository.BookingRepository;
import com.Airline.repository.FlightRepository;
import com.Airline.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private FlightRepository flightRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private PricingService pricingService;

    @Transactional
    public BookingDto createOrUpdateBooking(BookingDto bookingDto) {
        // Initialize booking, either by finding an existing one or creating a new one
        Booking booking = (bookingDto.getId() != null)
                ? bookingRepository.findById(bookingDto.getId()).orElse(new Booking())
                : new Booking();

        // Log current booking state
        System.out.println("Initial Booking: " + booking);

        // Map the BookingDto fields to the Booking entity
        modelMapper.map(bookingDto, booking);
        System.out.println("Mapped Booking from BookingDto: " + booking); // Log the mapped Booking

        // Retrieve user and flight, throw exceptions if not found
        User user = userRepository.findById(bookingDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        Flight flight = flightRepository.findById(bookingDto.getFlightId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid flight ID"));

        // Set additional booking properties
        booking.setUser(user);
        booking.setFlight(flight);

        // Calculate the total price based on flight and booking details
        booking.setTotalPrice(pricingService.calculateTotalPrice(flight, booking.getSeatClass(), booking.getExtraBags(), booking.getPassengerCount()));

        // Save the booking and check if it was saved successfully
        booking = bookingRepository.save(booking);
        System.out.println("Booking saved: " + booking); // Log the saved booking

        // Map the saved Booking back to BookingDto
        BookingDto savedBookingDto = modelMapper.map(booking, BookingDto.class);
        System.out.println("Mapped BookingDto after saving: " + savedBookingDto); // Log the mapped BookingDto

        // Manual mapping fallback in case modelMapper returns null
        if (savedBookingDto == null) {
            savedBookingDto = new BookingDto();
            savedBookingDto.setId(booking.getId());
            savedBookingDto.setUserId(booking.getUser().getId());
            savedBookingDto.setFlightId(booking.getFlight().getId());
            savedBookingDto.setSeatClass(booking.getSeatClass());
            savedBookingDto.setExtraBags(booking.getExtraBags());
            savedBookingDto.setPassengerCount(booking.getPassengerCount());
            savedBookingDto.setTotalPrice(booking.getTotalPrice());
        }

        return savedBookingDto;
    }



    public List<BookingDto> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(booking -> modelMapper.map(booking, BookingDto.class))
                .collect(Collectors.toList());
    }

    public BookingDto getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));
        return modelMapper.map(booking, BookingDto.class);
    }

    @Transactional
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    @Transactional
    public BookingDto checkIn(Long id, String seatNumber) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));
        booking.setSeatNumber(seatNumber);
        booking.setCheckedIn(true);
        booking = bookingRepository.save(booking);
        return modelMapper.map(booking, BookingDto.class);
    }
}
