import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSearch, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import BookingModal from '@/pages/Modal/BookingModal'; // Vérifiez le chemin d'importation
import DeleteBookingModal from '@/pages/Modal/DeleteBookingModal'; // Vérifiez le chemin d'importation
import SuccessModal from '@/pages/Modal/SuccessModal';
import ErrorModal from '@/pages/Modal/ErrorModal';

function BookingTable() {
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsPerPage] = useState(10);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);


    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('asc');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const result = await axiosInstance.get('/api/bookings');
                setBookings(result.data);
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            }
        };
        fetchBookings();
    }, []);

    const openAddModal = () => {
        setIsEditModalOpen(true);
        setCurrentBooking(null); // Reset current booking for new entry
    };

    const openEditModal = (booking) => {
        setCurrentBooking(booking);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const deleteBooking = async (bookingId) => {
        try {
            await axiosInstance.delete(`/api/bookings/${bookingId}`);
            setBookings(bookings.filter(booking => booking.id !== bookingId));
            setIsDeleteModalOpen(false); // Close the modal on success
        } catch (error) {
            console.error('Failed to delete booking:', error);
        }
    };

    return (
        <div className="mt-12 mb-8">
            <Card>
                <CardHeader color="blue" contentPosition="left">
                    <Typography variant="h6" color="white">
                        Booking Management
                    </Typography>
                    <button onClick={openAddModal} className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-700">
                        <FontAwesomeIcon icon={faPlusCircle} /> Add Booking
                    </button>
                </CardHeader>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Passenger Name</th>
                                    <th>Flight ID</th>
                                    {/* More columns as needed */}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td>{booking.id}</td>
                                        <td>{booking.passengerName}</td>
                                        <td>{booking.flightId}</td>
                                        {/* More cells as needed */}
                                        <td>
                                            <FontAwesomeIcon icon={faEdit} onClick={() => openEditModal(booking)} className="cursor-pointer text-blue-500 mx-2" />
                                            <FontAwesomeIcon icon={faTrashAlt} onClick={() => setIsDeleteModalOpen(true)} className="cursor-pointer text-red-500 mx-2" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Modals */}
            <BookingModal isOpen={isEditModalOpen} booking={currentBooking} onClose={closeEditModal} />
            <DeleteBookingModal isOpen={isDeleteModalOpen} onConfirm={() => deleteBooking(currentBooking.id)} onClose={() => setIsDeleteModalOpen(false)} />
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                successMessage={successMessage}
            />
            <ErrorModal
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                errorMessage={errorMessage}
            />
        </div>
    );
}

export default BookingTable;
