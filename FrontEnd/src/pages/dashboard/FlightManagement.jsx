import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSearch, faPlusCircle, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import FlightModal from '@/pages/Modal/FlightModal';
import DeleteModal from '@/pages/Modal/DeleteFlightModal';
import SuccessModal from '@/pages/Modal/SuccessModal';
import ErrorModal from '@/pages/Modal/ErrorModal';

function FlightTable() {
    const [flights, setFlights] = useState([]);
    const redColor = '#000000';
    const blueColor = '#732FD3'; // Red color for the price
    const [currentPage, setCurrentPage] = useState(1);
    const [flightsPerPage] = useState(5);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewFlight, setIsNewFlight] = useState(false);
    const [currentFlight, setCurrentFlight] = useState(null);
    const [editFormData, setEditFormData] = useState({
        airline: '',
        departureTime: '',
        arrivalTime: '',
        price: 0,
        originId: '',
        destinationId: '',
        aircraftId: ''
    });
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('asc');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [airports, setAirports] = useState([]);
    const [aircrafts, setAircrafts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const flightsResponse = await axiosInstance.get('/api/flights');
                setFlights(flightsResponse.data);
    
                const airportsResponse = await axiosInstance.get('/api/airports');
                setAirports(airportsResponse.data);
    
                const aircraftsResponse = await axiosInstance.get('/api/aircraft');
                setAircrafts(aircraftsResponse.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, []);
    

    const getRandomColor = () => {
        const colors = [
            '#d32f2f', // Red
            '#1976d2', // Blue
            '#f57c00', // Orange
            '#388e3c', // Dark Green
            '#7b1fa2', // Violet
            '#212121', // Black
            '#e64a19', // Deep Orange
            '#0288d1'  // Light Blue (additional color)
        ];
                return colors[Math.floor(Math.random() * colors.length)];
    };

    const Tag = ({ text, color }) => {
        return (
            <span style={{
                display: 'inline-block',
                padding: '0.5em 0.8em',  
                fontSize: '85%',  
                fontWeight: '800',
                fontStyle: 'font-semibold',
                lineHeight: '1',
                color: '#ffffff',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                verticalAlign: 'baseline',
                borderRadius: '1rem',
                backgroundColor: color
            }}>
                {text}
            </span>
        );
    };
    

    const getAirportCityById = (id) => {
        const airport = airports.find(airport => airport.id === id);
        return airport ? airport.city : 'Unknown';
    };

    // Function to get aircraft model by ID
    const getAircraftModelById = (id) => {
        const aircraft = aircrafts.find(aircraft => aircraft.id === id);
        return aircraft ? aircraft.model : 'Unknown';
    };


    const handleFormValidationError = (message) => {
        setErrorMessage(message);
        setIsErrorModalOpen(true);
        // Explicitly ensure the edit modal remains open
        setIsEditModalOpen(true);
    };

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const confirmEdit = async () => {
        if (!editFormData.airline || !editFormData.departureTime || !editFormData.arrivalTime || !editFormData.price || !editFormData.originId || !editFormData.destinationId) {
            handleFormValidationError('All fields are required.');
            return;
        }
    
        if (editFormData.price <= 0) {
            handleFormValidationError('Price must be positive.');
            return;
        }
    
        if (new Date(editFormData.departureTime) >= new Date(editFormData.arrivalTime)) {
            handleFormValidationError('Departure time must be before arrival time.');
            return;
        }
    
        try {
            const response = isNewFlight ?
                await axiosInstance.post('/api/flights', editFormData) :
                await axiosInstance.put(`/api/flights/${currentFlight.id}`, editFormData);
    
            setFlights(currentFlight ? flights.map(f => f.id === currentFlight.id ? { ...f, ...response.data } : f) : [...flights, response.data]);
            setIsSuccessModalOpen(true);
            setSuccessMessage(isNewFlight ? 'Flight added successfully' : 'Flight updated successfully');
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error during flight operation:', error);
            setErrorMessage(`Failed to ${isNewFlight ? 'add' : 'update'} flight: ${error.response ? error.response.data.message : 'Server error'}`);
            setIsErrorModalOpen(true);
        }
    };
    

    const openAddModal = () => {
        console.log("Opening add modal...");
        setIsNewFlight(true);
        setCurrentFlight(null);
        setEditFormData({
            airline: '',
            departureTime: '',
            arrivalTime: '',
            price: 0,
            originId: '',
            destinationId: '',
            aircraftId: ''
        });
        setIsEditModalOpen(true);
        console.log("Modal should be open now", { isNewFlight: true, currentFlight: null, isEditModalOpen: true });
    };
    
    const openEditModal = (flight) => {
        console.log("Opening edit modal...", flight);
        setIsNewFlight(false);
        setCurrentFlight(flight);
        setEditFormData({
            airline: flight.airline,
            departureTime: flight.departureTime,
            arrivalTime: flight.arrivalTime,
            price: flight.price,
            originId: flight.originId,
            destinationId: flight.destinationId,
            aircraftId: flight.aircraftId
        });
        setIsEditModalOpen(true);
        console.log("Modal should be open now", { isNewFlight: false, currentFlight: flight, isEditModalOpen: true });
    };
    
    
    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const deleteFlight = async (flightId) => {
        try {
            await axiosInstance.delete(`/api/flights/${flightId}`);
            const updatedFlights = flights.filter(flight => flight.id !== flightId);
            setFlights(updatedFlights);
            setIsSuccessModalOpen(true);
            setSuccessMessage('Flight deleted successfully');
        } catch (error) {
            console.error('Failed to delete flight:', error);
            setErrorMessage('Failed to delete flight due to server error.');
            setIsErrorModalOpen(true);
        }
    };

    const handleDeleteConfirmation = (flight) => {
        setCurrentFlight(flight);
        setIsDeleteModalOpen(true);
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        sessionStorage.setItem('currentPage', pageNumber); // Store current page in sessionStorage
    };

    useEffect(() => {
        const savedPage = sessionStorage.getItem('currentPage');
        if (savedPage) {
            setCurrentPage(Number(savedPage));
        }
    }, []);

    const filteredFlights = flights.filter(flight =>
        (typeof flight.airline === 'string' && flight.airline.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof flight.originId === 'string' && flight.originId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof flight.destinationId === 'string' && flight.destinationId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    

    const sortFlights = (sortBy) => {
        let sortedFlights;
        if (sortBy === 'price') {
            sortedFlights = [...filteredFlights].sort((a, b) => {
                if (sortType === 'asc') {
                    return a.price - b.price;
                } else {
                    return b.price - a.price;
                }
            });
        } else if (sortBy === 'airline') {
            sortedFlights = [...filteredFlights].sort((a, b) => {
                const airlineA = a.airline.toLowerCase();
                const airlineB = b.airline.toLowerCase();
                if (sortType === 'asc') {
                    return airlineA > airlineB ? 1 : -1;
                } else {
                    return airlineA < airlineB ? 1 : -1;
                }
            });
        }
    
        setSortType(sortType === 'asc' ? 'desc' : 'asc');
        setFlights(sortedFlights);
    };
    

    const indexOfLastFlight = currentPage * flightsPerPage;
    const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
    const currentFlights = filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);

    return (
        <div className="mt-12 mb-8">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                        Flight Management
                    </Typography>
                    <button onClick={openAddModal} className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-700 flex items-center">
                        <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                        Add Flight
                    </button>
                </CardHeader>
                <CardBody className="overflow-x-auto px-0 pt-0 pb-2 shadow-lg">
                    <div className="flex justify-end mb-4 pr-10">
                        <div className="relative w-80">
                            <FontAwesomeIcon icon={faSearch} className="absolute text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by Airline "
                                className="pl-10 pr-4 py-2 border border-gray-900 rounded-md w-full"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <table className="w-full min-w-[1200px] table-auto">
                        <thead>
                            <tr>
                                {["ID", "Airline", "Departure", "Arrival", "Price", "Origin", "Destination", "Model", "Actions"].map((header, index) => (
                                    <th key={header} className={`border-b border-gray-200 py-3 px-5 text-left text-sm font-semibold text-gray-500 uppercase ${index === 1 || index === 4 ? 'cursor-pointer hover:bg-gray-100 relative' : ''}`} onClick={() => index === 1 ? sortFlights('airline') : index === 4 ? sortFlights('price') : null}>
                                        {header} {index === 1 ? <FontAwesomeIcon icon={sortType === 'asc' ? faSortUp : faSortDown} className="absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2" /> : index === 4 ? <FontAwesomeIcon icon={sortType === 'asc' ? faSortUp : faSortDown} className="absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2" /> : null}
                                    </th>
   
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentFlights.map(flight => (
                                <tr key={flight.id}>
                                    <td className="py-3 px-5">{flight.id}</td>
                                    <td className="py-3 px-5"><Tag text={`${flight.airline}`} color={blueColor} /></td>
                                    <td className="py-3 px-5">{flight.departureTime}</td>
                                    <td className="py-3 px-5">{flight.arrivalTime}</td>
                                    <td className="py-3 px-5"><Tag text={`$${flight.price}`} color={redColor} /></td>
                                    <td className="py-3 px-5"><Tag text={getAirportCityById(flight.originId)} color={getRandomColor()} /></td>
                                    <td className="py-3 px-5"><Tag text={getAirportCityById(flight.destinationId)} color={getRandomColor()} /></td>
                                    <td className="py-3 px-5">{getAircraftModelById(flight.aircraftId)}</td>
                                    <td className="py-3 px-5 text-center">
                                        <FontAwesomeIcon icon={faEdit} onClick={() => openEditModal(flight)} className="text-blue-500 hover:text-blue-600 cursor-pointer mx-2" />
                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => handleDeleteConfirmation(flight)} className="text-red-500 hover:text-red-600 cursor-pointer mx-2" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-center mt-4">
                        <nav aria-label="Page navigation">
                            <ul className="inline-flex items-center -space-x-px">
                                <li>
                                    <button
                                        className={`py-2 px-3 ml-0 leading-tight text-black bg-white rounded-l-lg border border-gray-400 hover:bg-blue-500 hover:text-white ${currentPage === 1 ? 'bg-blue-300 text-black' : ''}`}
                                        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                                        disabled={currentPage === 1}
                                    >
                                        <span className="sr-only">Previous</span>&#8592;
                                    </button>
                                </li>
                                {Array.from({ length: Math.ceil(filteredFlights.length / flightsPerPage) }, (_, i) => (
                                    <li key={i}>
                                        <button
                                            onClick={() => handlePageClick(i + 1)}
                                            className={`py-2 px-3 leading-tight text-black bg-white border border-gray-400 ${
                                                currentPage === i + 1 ? "bg-blue-900 text-white" : "hover:bg-blue-500 hover:text-white"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        className={`py-2 px-3 leading-tight text-black bg-white rounded-r-lg border border-gray-400 hover:bg-blue-500 hover:text-white ${currentPage === Math.ceil(filteredFlights.length / flightsPerPage) ? 'bg-blue-300 text-black' : ''}`}
                                        onClick={() => setCurrentPage(currentPage < Math.ceil(filteredFlights.length / flightsPerPage) ? currentPage + 1 : currentPage)}
                                        disabled={currentPage === Math.ceil(filteredFlights.length / flightsPerPage)}
                                    >
                                        <span className="sr-only">Next</span>&#8594;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </CardBody>
            </Card>
            <FlightModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    formData={editFormData}
                    onFormChange={handleEditFormChange}
                    onSubmit={confirmEdit}
                    isNewFlight={isNewFlight}
                    handleFormValidationError={handleFormValidationError}
                    setIsEditModalOpen={setIsEditModalOpen} // Make sure to pass this prop
                    airports={airports}  // Pass airports data as prop
                    aircrafts={aircrafts}
                />


            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    deleteFlight(currentFlight.id);
                    setIsDeleteModalOpen(false);
                }}
            />
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

export default FlightTable;
