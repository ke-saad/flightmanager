import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSearch, faPlusCircle, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from '@/pages/Modal/DeleteAirportModal';
import AirportModal from '@/pages/Modal/AirportModal';
import SuccessModal from '@/pages/Modal/SuccessModal';
import ErrorModal from '@/pages/Modal/ErrorModal';

function AirportTable() {
    const [airports, setAirports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [airportsPerPage] = useState(5);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewAirport, setIsNewAirport] = useState(false);
    const [currentAirport, setCurrentAirport] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        code: '',
        country: '',
        city: ''
 
    });
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('asc');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/api/airports');
                setAirports(response.data.map(airport => ({
                    ...airport,
                    colorCode: getRandomColor(), // Assign a random color for the code
                    colorCity: getRandomColor()  // Assign a random color for the city
                })));
            } catch (error) {
                console.error('Failed to fetch airport data:', error);
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
    
        // Validation for required fields
        if (!editFormData.name || !editFormData.code || !editFormData.city || !editFormData.country) {
            setErrorMessage('All fields are required.');
            setIsErrorModalOpen(true);
            return; // Stop the function execution if any required fields are missing
        }
    
        // Validation for the airport code length
        if (editFormData.code.length !== 3) {
            setErrorMessage('Airport code must be exactly 3 characters.');
            setIsErrorModalOpen(true);
            return;
        }
    
        // Check for unique airport code
        if (isNewAirport || currentAirport.code !== editFormData.code) {
            const codeExists = airports.some(airport => airport.code === editFormData.code && airport.id !== currentAirport?.id);
            if (codeExists) {
                setErrorMessage('Airport code already in use.');
                setIsErrorModalOpen(true);
                return;
            }
        }
    
        // Check for unique airport name
        if (isNewAirport || currentAirport.name !== editFormData.name) {
            const nameExists = airports.some(airport => airport.name === editFormData.name && airport.id !== currentAirport?.id);
            if (nameExists) {
                setErrorMessage('Airport name already in use.');
                setIsErrorModalOpen(true);
                return;
            }
        }
    
        try {
            const response = isNewAirport ?
                await axiosInstance.post('/api/airports', editFormData) :
                await axiosInstance.put(`/api/airports/${currentAirport.id}`, editFormData);
    
            const updatedAirports = isNewAirport ?
                [...airports, response.data] :
                airports.map(ap => ap.id === currentAirport.id ? { ...ap, ...response.data } : ap);
    
            setAirports(updatedAirports);
            setIsSuccessModalOpen(true);
            setSuccessMessage(isNewAirport ? 'Airport added successfully' : 'Airport updated successfully');
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Failed to update airport:', error);
            setErrorMessage('Failed to update airport due to server error.');
            setIsErrorModalOpen(true);
        }
    };
    
    
    
    const openAddModal = () => {
        setIsNewAirport(true);
        setCurrentAirport(null);
        setEditFormData({
            name: '',
            code: '',
            country: '',
            city: ''
        });
        setIsEditModalOpen(true);
    };

    const openEditModal = (airport) => {
        setIsNewAirport(false);
        setCurrentAirport(airport);
        setEditFormData({
            name: airport.name,
            code: airport.code,
            country: airport.country,
            city: airport.city

        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const deleteAirport = async (airportId) => {
        try {
            await axiosInstance.delete(`/api/airports/${airportId}`);
            const updatedAirports = airports.filter(ap => ap.id !== airportId);
            setAirports(updatedAirports);
            setIsSuccessModalOpen(true);
            setSuccessMessage('Airport deleted successfully');
        } catch (error) {
            console.error('Failed to delete airport:', error);
        }
    };

    const handleDeleteConfirmation = (airport) => {
        setCurrentAirport(airport);
        setIsDeleteModalOpen(true);
    };
    
    const Tag = ({ text, color }) => {
        return (
            <span style={{
                display: 'inline-block',
                padding: '0.5em 0.8em',  // Increased padding for larger size
                fontSize: '85%',  // Slightly larger font size
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

    const filteredAirports = airports.filter(ap =>
        ap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ap.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ap.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortAirports = () => {
        const sortedAirports = [...filteredAirports].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (sortType === 'asc') {
                return nameA > nameB ? 1 : -1;
            } else {
                return nameA < nameB ? 1 : -1;
            }
        });

        setSortType(sortType === 'asc' ? 'desc' : 'asc');
        setAirports(sortedAirports);
    };

    const indexOfLastAirport = currentPage * airportsPerPage;
    const indexOfFirstAirport = indexOfLastAirport - airportsPerPage;
    const currentAirports = filteredAirports.slice(indexOfFirstAirport, indexOfLastAirport);

    return (
        <div className="mt-12 mb-8">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                        Airport Management
                    </Typography>
                    <button onClick={openAddModal} className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-700 flex items-center">
                        <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                        Add Airport
                    </button>
                </CardHeader>
                <CardBody className="overflow-x-auto px-0 pt-0 pb-2 shadow-lg">
                    <div className="flex justify-end mb-4 pr-10">
                        <div className="relative w-80">
                            <FontAwesomeIcon icon={faSearch} className="absolute text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by Name, City, or Country"
                                className="pl-10 pr-4 py-2 border border-gray-900 rounded-md w-full"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["ID", "Name", "Code", "Country",  "City", "Actions"].map((header, index) => (
                                    <th key={header} className={`border-b border-gray-200 py-3 px-5 text-left text-sm font-semibold text-gray-500 uppercase ${index === 1 ? 'cursor-pointer hover:bg-gray-100 relative' : ''}`} onClick={() => index === 1 ? sortAirports() : null}>
                                        {header} {index === 1 ? <FontAwesomeIcon icon={sortType === 'asc' ? faSortUp : faSortDown} className="absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2" /> : null}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentAirports.map(airport => (
                                <tr key={airport.id}>
                                    <td className="py-3 px-5">{airport.id}</td>
                                    <td className="py-3 px-5">{airport.name}</td>
                                    <td className="py-3 px-5"><Tag text={airport.code} color={airport.colorCode} /></td>
                                    <td className="py-3 px-5">{airport.country}</td>
                                    <td className="py-3 px-5"><Tag text={airport.city} color={airport.colorCity} /></td>
                                    <td className="py-3 px-5 text-center">
                                        <FontAwesomeIcon icon={faEdit} onClick={() => openEditModal(airport)} className="text-blue-500 hover:text-blue-600 cursor-pointer mx-2" />
                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => handleDeleteConfirmation(airport)} className="text-red-500 hover:text-red-600 cursor-pointer mx-2" />
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
                                {Array.from({ length: Math.ceil(filteredAirports.length / airportsPerPage) }, (_, i) => (
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
                                        className={`py-2 px-3 leading-tight text-black bg-white rounded-r-lg border border-gray-400 hover:bg-blue-500 hover:text-white ${currentPage === Math.ceil(filteredAirports.length / airportsPerPage) ? 'bg-blue-300 text-black' : ''}`}
                                        onClick={() => setCurrentPage(currentPage < Math.ceil(filteredAirports.length / airportsPerPage) ? currentPage + 1 : currentPage)}
                                        disabled={currentPage === Math.ceil(filteredAirports.length / airportsPerPage)}
                                    >
                                        <span className="sr-only">Next</span>&#8594;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </CardBody>
            </Card>
            <AirportModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                formData={editFormData}
                onFormChange={handleEditFormChange}
                onSubmit={confirmEdit}
                isNewAirport={isNewAirport}
                handleFormValidationError={handleFormValidationError}
                airports={airports} // Assurez-vous de passer la liste des aéroports ici

            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    deleteAirport(currentAirport.id);
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

export default AirportTable;
