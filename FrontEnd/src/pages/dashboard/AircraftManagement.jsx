import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt,faPlane, faSearch, faPlusCircle, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from '@/pages/Modal/DeleteAircraftModal';
import AircraftModal from '@/pages/Modal/AircraftModal';
import SuccessModal from '@/pages/Modal/SuccessModal';
import ErrorModal from '@/pages/Modal/ErrorModal';  // Ensure you have imported ErrorModal

function AircraftTable() {
    const [aircrafts, setAircrafts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [aircraftsPerPage] = useState(5);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewAircraft, setIsNewAircraft] = useState(false);
    const [currentAircraft, setCurrentAircraft] = useState(null);
    const [editFormData, setEditFormData] = useState({
        model: '',
        registrationNumber: '',
        seatingCapacity: 0,
        status: ''
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
                const response = await axiosInstance.get('/api/aircraft');
                setAircrafts(response.data);
            } catch (error) {
                console.error('Failed to fetch aircraft data:', error);
            }
        };
        fetchData();
    }, []);

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

    function getStatusTag(status) {
        const statusColor = {
            ACTIVE: 'bg-green-500 , font-semibold' ,
            MAINTENANCE: 'bg-orange-500 , font-semibold',
            DECOMMISSIONED: 'bg-red-500 , font-semibold',
            RESERVED: 'bg-blue-500 , font-semibold'
        };
    
        return <span className={`text-white py-1 px-3 rounded-full text-xs ${statusColor[status] || 'bg-gray-200'}`}>
            {status}
        </span>;
    }
    
    const confirmEdit = async (event) => {

        // Validation for empty fields
        if (!editFormData.model || !editFormData.registrationNumber || !editFormData.seatingCapacity || !editFormData.status) {
            setErrorMessage('All fields are required.');
            setIsErrorModalOpen(true);
            return; // Stop the function execution here if any required fields are missing
        }

        // Check for unique registration number
        if (isNewAircraft || currentAircraft.registrationNumber !== editFormData.registrationNumber) {
            const exists = aircrafts.some(ac => ac.registrationNumber === editFormData.registrationNumber);
            if (exists) {
                setErrorMessage('Registration number already in use.');
                setIsErrorModalOpen(true);
                return;
            }
        }

        try {
            const response = isNewAircraft ?
                await axiosInstance.post('/api/aircraft', editFormData) :
                await axiosInstance.put(`/api/aircraft/${currentAircraft.id}`, editFormData);

            const updatedAircrafts = isNewAircraft ?
                [...aircrafts, response.data] :
                aircrafts.map(ac => ac.id === currentAircraft.id ? { ...ac, ...response.data } : ac);

            setAircrafts(updatedAircrafts);
            setIsSuccessModalOpen(true);
            setSuccessMessage(isNewAircraft ? 'Aircraft added successfully' : 'Aircraft updated successfully');
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Failed to update aircraft:', error);
        }
    };

    const openAddModal = () => {
        setIsNewAircraft(true);
        setCurrentAircraft(null);
        setEditFormData({
            model: '',
            registrationNumber: '',
            seatingCapacity: 0,
            status: ''
        });
        setIsEditModalOpen(true);
    };

    const openEditModal = (aircraft) => {
        setIsNewAircraft(false);
        setCurrentAircraft(aircraft);
        setEditFormData({
            model: aircraft.model,
            registrationNumber: aircraft.registrationNumber,
            seatingCapacity: aircraft.seatingCapacity,
            status: aircraft.status
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const deleteAircraft = async (aircraftId) => {
        try {
            await axiosInstance.delete(`/api/aircraft/${aircraftId}`);
            const updatedAircrafts = aircrafts.filter(ac => ac.id !== aircraftId);
            setAircrafts(updatedAircrafts);
            setIsSuccessModalOpen(true);
            setSuccessMessage('Aircraft deleted successfully');
        } catch (error) {
            console.error('Failed to delete aircraft:', error);
        }
    };

    const handleDeleteConfirmation = (aircraft) => {
        setCurrentAircraft(aircraft);
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

    const filteredAircrafts = aircrafts.filter(ac =>
        ac.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ac.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastAircraft = currentPage * aircraftsPerPage;
    const indexOfFirstAircraft = indexOfLastAircraft - aircraftsPerPage;
    const currentAircrafts = filteredAircrafts.slice(indexOfFirstAircraft, indexOfLastAircraft);

    const sortAircrafts = (sortBy) => {
        const sortedAircrafts = [...filteredAircrafts].sort((a, b) => {
            if (sortType === 'asc') {
                return a[sortBy] > b[sortBy] ? 1 : -1;
            } else {
                return a[sortBy] < b[sortBy] ? 1 : -1;
            }
        });

        setSortType(sortType === 'asc' ? 'desc' : 'asc');
        setAircrafts(sortedAircrafts);
    };

    return (
        <div className="mt-12 mb-8">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                        Aircraft Management
                    </Typography>
                    <button onClick={openAddModal} className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-700 flex items-center">
                        <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                        Add Aircraft
                    </button>
                </CardHeader>
                <CardBody className="overflow-x-auto px-0 pt-0 pb-2 shadow-lg">
                    <div className="flex justify-end mb-4 pr-10">
                        <div className="relative w-80">
                            <FontAwesomeIcon icon={faSearch} className="absolute text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by Model or Status"
                                className="pl-10 pr-4 py-2 border border-gray-900 rounded-md w-full"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["ID", "Model", "Registration Number", "Seating Capacity", "Status", "Actions"].map((header, index) => (
                                    <th key={header} className={`border-b border-gray-200 py-3 px-5 text-left text-sm font-semibold text-gray-500 uppercase ${index === 1 || index === 3 ? 'cursor-pointer hover:bg-gray-100 relative' : ''}`} onClick={() => index === 1 ? sortAircrafts('model') : index === 3 ? sortAircrafts('seatingCapacity') : null}>
                                        {header} {index === 1 || index === 3 ? <FontAwesomeIcon icon={sortType === 'asc' ? faSortUp : faSortDown} className="absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2" /> : null}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentAircrafts.map(aircraft => (
                                <tr key={aircraft.id}>
                                    <td className="py-3 px-5">{aircraft.id}</td>
                                    <td className="py-3 px-5">{aircraft.model}</td>
                                    <td className="py-3 px-5">{aircraft.registrationNumber}</td>
                                    <td className="py-3 px-5">{aircraft.seatingCapacity}</td>
                                    <td className="py-3 px-5">{getStatusTag(aircraft.status)}</td>
                                    <td className="py-3 px-5 text-center">
                                        <FontAwesomeIcon icon={faEdit} onClick={() => openEditModal(aircraft)} className="text-blue-500 hover:text-blue-600 cursor-pointer mx-2" />
                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => handleDeleteConfirmation(aircraft)} className="text-red-500 hover:text-red-600 cursor-pointer mx-2" />
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
                                {Array.from({ length: Math.ceil(filteredAircrafts.length / aircraftsPerPage) }, (_, i) => (
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
                                        className={`py-2 px-3 leading-tight text-black bg-white rounded-r-lg border border-gray-400 hover:bg-blue-500 hover:text-white ${currentPage === Math.ceil(filteredAircrafts.length / aircraftsPerPage) ? 'bg-blue-300 text-black' : ''}`}
                                        onClick={() => setCurrentPage(currentPage < Math.ceil(filteredAircrafts.length / aircraftsPerPage) ? currentPage + 1 : currentPage)}
                                        disabled={currentPage === Math.ceil(filteredAircrafts.length / aircraftsPerPage)}
                                    >
                                        <span className="sr-only">Next</span>&#8594;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </CardBody>
            </Card>
            <AircraftModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                formData={editFormData}
                onFormChange={handleEditFormChange}
                onSubmit={confirmEdit}
                isNewAircraft={isNewAircraft}
                handleFormValidationError={handleFormValidationError}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    deleteAircraft(currentAircraft.id);
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

export default AircraftTable;