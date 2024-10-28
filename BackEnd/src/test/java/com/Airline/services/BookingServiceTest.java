package com.Airline.services;

import com.Airline.DTO.BookingDto;
import com.Airline.enums.SeatClass;
import com.Airline.model.Booking;
import com.Airline.model.Flight;
import com.Airline.model.User;
import com.Airline.repository.BookingRepository;
import com.Airline.repository.FlightRepository;
import com.Airline.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class BookingServiceTest {

    @InjectMocks
    private BookingService bookingService;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private FlightRepository flightRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private PricingService pricingService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testCreateOrUpdateBooking() {
        // Create DTOs and entities
        BookingDto bookingDto = new BookingDto();
        bookingDto.setId(null); // For new booking
        bookingDto.setUserId(1L);
        bookingDto.setFlightId(1L);
        bookingDto.setSeatClass(SeatClass.ECONOMY);
        bookingDto.setExtraBags(0);
        bookingDto.setPassengerCount(1);

        User user = new User();
        user.setId(1L);

        Flight flight = new Flight();
        flight.setId(1L);

        Booking unsavedBooking = new Booking();
        unsavedBooking.setUser(user);
        unsavedBooking.setFlight(flight);
        unsavedBooking.setSeatClass(SeatClass.ECONOMY);
        unsavedBooking.setExtraBags(0);
        unsavedBooking.setPassengerCount(1);
        unsavedBooking.setReservationDate(new Date());

        Booking savedBooking = new Booking();
        savedBooking.setId(1L);
        savedBooking.setUser(user);
        savedBooking.setFlight(flight);
        savedBooking.setSeatClass(SeatClass.ECONOMY);
        savedBooking.setExtraBags(0);
        savedBooking.setPassengerCount(1);
        savedBooking.setTotalPrice(100.0);
        savedBooking.setReservationDate(new Date());

        // Expected DTO after saving
        BookingDto expectedSavedBookingDto = new BookingDto();
        expectedSavedBookingDto.setId(1L);
        expectedSavedBookingDto.setUserId(user.getId());
        expectedSavedBookingDto.setFlightId(flight.getId());
        expectedSavedBookingDto.setSeatClass(SeatClass.ECONOMY);
        expectedSavedBookingDto.setExtraBags(0);
        expectedSavedBookingDto.setPassengerCount(1);
        expectedSavedBookingDto.setTotalPrice(100.0);

        // Mock repository calls
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));
        when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);
        when(pricingService.calculateTotalPrice(any(Flight.class), any(SeatClass.class), anyInt(), anyInt()))
                .thenReturn(100.0);

        // Mock ModelMapper for both mapping scenarios
        when(modelMapper.map(any(BookingDto.class), eq(Booking.class))).thenReturn(unsavedBooking);
        when(modelMapper.map(any(Booking.class), eq(BookingDto.class))).thenReturn(expectedSavedBookingDto);

        // Call the service method
        BookingDto savedBookingDto = bookingService.createOrUpdateBooking(bookingDto);

        // Assertions
        assertNotNull(savedBookingDto, "SavedBookingDto should not be null");
        assertEquals(1L, savedBookingDto.getId());
        assertEquals(bookingDto.getUserId(), savedBookingDto.getUserId());
        assertEquals(bookingDto.getFlightId(), savedBookingDto.getFlightId());
        assertEquals(100.0, savedBookingDto.getTotalPrice());

        // Verify interactions
        verify(userRepository).findById(1L);
        verify(flightRepository).findById(1L);
        verify(modelMapper).map(any(BookingDto.class), any(Booking.class));
        verify(bookingRepository).save(any(Booking.class));
        verify(modelMapper).map(any(Booking.class), eq(BookingDto.class));
    }



    @Test
    public void testGetAllBookings() {
        Booking booking1 = new Booking();
        Booking booking2 = new Booking();
        BookingDto bookingDto1 = new BookingDto();
        BookingDto bookingDto2 = new BookingDto();

        when(bookingRepository.findAll()).thenReturn(Arrays.asList(booking1, booking2));
        when(modelMapper.map(booking1, BookingDto.class)).thenReturn(bookingDto1);
        when(modelMapper.map(booking2, BookingDto.class)).thenReturn(bookingDto2);

        List<BookingDto> bookingDtos = bookingService.getAllBookings();

        assertEquals(2, bookingDtos.size());
        assertEquals(bookingDto1, bookingDtos.get(0));
        assertEquals(bookingDto2, bookingDtos.get(1));
    }

    @Test
    public void testGetBookingById() {
        Booking booking = new Booking();
        BookingDto bookingDto = new BookingDto();

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(modelMapper.map(booking, BookingDto.class)).thenReturn(bookingDto);

        BookingDto foundBooking = bookingService.getBookingById(1L);

        assertEquals(bookingDto, foundBooking);
    }

    @Test
    public void testGetBookingById_NotFound() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            bookingService.getBookingById(1L);
        });
    }

    @Test
    public void testDeleteBooking() {
        doNothing().when(bookingRepository).deleteById(1L);

        bookingService.deleteBooking(1L);

        verify(bookingRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testCheckIn() {
        Booking booking = new Booking();
        BookingDto bookingDto = new BookingDto();
        bookingDto.setSeatNumber("12A");

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(booking)).thenReturn(booking);
        when(modelMapper.map(booking, BookingDto.class)).thenReturn(bookingDto);

        BookingDto checkedInBooking = bookingService.checkIn(1L, "12A");

        assertEquals("12A", checkedInBooking.getSeatNumber());
        verify(bookingRepository, times(1)).save(booking);
    }
}
