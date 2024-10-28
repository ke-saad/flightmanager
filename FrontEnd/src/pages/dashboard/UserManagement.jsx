// UserTable.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSearch, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from '@/pages/Modal/DeleteModal';
import EditModal from '@/pages/Modal/EditModal';
import SuccessModal from '@/pages/Modal/SuccessModal';
import ErrorModal from '@/pages/Modal/ErrorModal';

function UserTable() {
    const [errorMessage, setErrorMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(6);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: ''
    });
    const [isRoleAdmin, setIsRoleAdmin] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortByIdAsc, setSortByIdAsc] = useState(true);
    const [sortByLastNameAsc, setSortByLastNameAsc] = useState(true);
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/api/users/all');
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, []);

    const openDeleteModal = (user) => {
        setCurrentUser(user);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCurrentUser(null);
    };

    const confirmDelete = async () => {
        try {
            await axiosInstance.delete(`/api/users/${currentUser.id}`);
            const remainingUsers = users.filter(user => user.id !== currentUser.id);
            setUsers(remainingUsers);
            setSuccessMessage('User deleted successfully');
            setIsSuccessModalOpen(true);
            closeDeleteModal();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const openEditModal = (user) => {
        setCurrentUser(user);
        const isAdmin = user.roles.includes('ROLE_ADMIN');
        setEditFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            roles: isAdmin ? ['ROLE_ADMIN'] : ['ROLE_USER']
        });
        setIsRoleAdmin(isAdmin);
        setIsEditModalOpen(true);
    };

    const handleEditFormChange = event => {
        const { name, value } = event.target;
        setEditFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const confirmEdit = async (event) => {
        event.preventDefault();
    
        // Validation for empty fields
        const { firstName, lastName, username, email } = editFormData;
        if (!firstName || !lastName || !username || !email) {
            setErrorMessage('All fields are required.');
            setIsErrorModalOpen(true);
            return; // Stop the function execution if any required fields are missing
        }
    
        // Check for unique username
        if (currentUser && currentUser.username !== username) {
            const usernameExists = users.some(user => user.username === username && user.id !== currentUser.id);
            if (usernameExists) {
                setErrorMessage('Username must be unique.');
                setIsErrorModalOpen(true);
                return;
            }
        }
    
        // Check for unique email
        if (currentUser && currentUser.email !== email) {
            const emailExists = users.some(user => user.email === email && user.id !== currentUser.id);
            if (emailExists) {
                setErrorMessage('Email must be unique.');
                setIsErrorModalOpen(true);
                return;
            }
            // Email format validation
            if (!emailFormat.test(email)) {
                setErrorMessage('Invalid Email format .');
                setIsErrorModalOpen(true);
                return;
            }
        }
    
        try {
            // If currentUser is defined, update the user, else add a new user
            const response = currentUser ? 
                await axiosInstance.put(`/api/users/${currentUser.id}`, editFormData) :
                await axiosInstance.post('/api/users', editFormData);
    
            // Update users array accordingly
            const updatedUsers = currentUser ?
                users.map(user => user.id === currentUser.id ? { ...user, ...response.data } : user) :
                [...users, response.data];
    
            setUsers(updatedUsers);
            setSuccessMessage(currentUser ? 'User updated successfully' : 'User added successfully');
            setIsSuccessModalOpen(true);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Failed to update or add user:', error);
            setErrorMessage('Failed to update or add user. Please try again.');
            setIsErrorModalOpen(true);
        }
    };
    
    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const toggleRole = () => {
        setIsRoleAdmin(current => !current); // Toggle the current admin status
        setEditFormData(prevFormData => {
            let updatedRoles;
    
            if (isRoleAdmin) {
                // If currently an admin, switch to only user
                updatedRoles = ['ROLE_USER'];
            } else {
                // If currently not an admin, switch to only admin
                updatedRoles = ['ROLE_ADMIN'];
            }
    
            return {
                ...prevFormData,
                roles: updatedRoles
            };
        });
    };

    const roleLabel = roles => roles.includes('ROLE_ADMIN') ? 'Admin' : 'User';

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const sortUsersByID = () => {
        const sortedUsers = [...users].sort((a, b) => (sortByIdAsc ? a.id - b.id : b.id - a.id));
        setUsers(sortedUsers);
        setSortByIdAsc(!sortByIdAsc); // Inverse le type de tri pour la prochaine fois
    };

    const sortUsersByLastName = () => {
        const sortedUsers = [...users].sort((a, b) => {
            if (sortByLastNameAsc) {
                return a.lastName.localeCompare(b.lastName);
            } else {
                return b.lastName.localeCompare(a.lastName);
            }
        });
        setUsers(sortedUsers);
        setSortByLastNameAsc(!sortByLastNameAsc); // Inverse le type de tri pour la prochaine fois
    };

    const filteredUsers = currentUsers.filter(user =>
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (searchTerm.toLowerCase() === 'admin' && user.roles.includes('ROLE_ADMIN')) ||
        (searchTerm.toLowerCase() === 'user' && user.roles.includes('ROLE_USER'))
    );

    return (
        <div className="mt-12 mb-8">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        User Management
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-auto px-0 pt-0 pb-2 shadow-lg">
                    <div className="flex justify-end mb-4 pr-10">
                        <div className="relative w-96">
                            <FontAwesomeIcon icon={faSearch} className="absolute text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by Last Name, Username, or Role"
                                className="pl-10 pr-4 py-2 border border-gray-900 rounded-md w-full"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <table className="w-full  min-w-[640px] table-auto" >
                        <thead>
                            <tr>
                            {["ID", "First Name", "Last Name", "Username", "Email", "Roles", "Actions"].map((header, index) => (
                                    <th key={header} className={`border-b border-gray-200 py-3 px-5 text-left text-sm font-semibold text-gray-500 uppercase ${index === 0 || index === 2 ? 'cursor-pointer hover:bg-gray-100 relative' : ''}`} onClick={index === 0 ? sortUsersByID : (index === 2 ? sortUsersByLastName : null)}>
                                        {header}
                                        {index === 0 && (
                                            <FontAwesomeIcon
                                                icon={sortByIdAsc ? faSortUp : faSortDown}
                                                className="absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2"
                                            />
                                        )}
                                        {index === 2 && (
                                            <FontAwesomeIcon
                                                icon={sortByLastNameAsc ? faSortUp : faSortDown}
                                                className="absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2"
                                            />
                                        )}
                                    </th>
                                ))}

                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="py-3 px-5">{user.id}</td>
                                    <td className="py-3 px-5">{user.firstName}</td>
                                    <td className="py-3 px-5">{user.lastName}</td>
                                    <td className="py-3 px-5">{user.username}</td>
                                    <td className="py-3 px-5">{user.email}</td>
                                    <td className="py-3 px-5">
                                        <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${user.roles.includes('ROLE_ADMIN') ? 'text-white bg-green-500' : 'text-white bg-red-500'}`}>
                                            {roleLabel(user.roles)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-5 text-center">
                                        <FontAwesomeIcon icon={faEdit} onClick={() => openEditModal(user)} className="text-blue-500 hover:text-blue-600 cursor-pointer mx-2" />
                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => openDeleteModal(user)} className="text-red-500 hover:text-red-600 cursor-pointer mx-2" />
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
                                        className="py-2 px-3 ml-0 leading-tight text-black bg-white rounded-l-lg border border-gray-400 hover:bg-blue-500 hover:text-white"
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : currentPage)}
                                        disabled={currentPage === 1}
                                    >
                                        <span className="sr-only">Previous</span>&#8592;
                                    </button>
                                </li>
                                {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => (
                                    <li key={i}>
                                        <button
                                            onClick={() => paginate(i + 1)}
                                            className={`py-2 px-3 leading-tight text-black bg-white border border-gray-400 ${
                                                currentPage === i + 1 ? "bg-blue-800 text-white" : "hover:bg-blue-500 hover:text-white"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        className="py-2 px-3 leading-tight text-black bg-white rounded-r-lg border border-gray-400 hover:bg-blue-500 hover:text-white"
                                        onClick={() => paginate(currentPage < Math.ceil(users.length / usersPerPage) ? currentPage + 1 : currentPage)}
                                        disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                                    >
                                        <span className="sr-only">Next</span>&#8594;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </CardBody>
            </Card>
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
            />
            <EditModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                formData={editFormData}
                onFormChange={handleEditFormChange}
                onSubmit={confirmEdit}
                isRoleAdmin={isRoleAdmin}
                toggleRole={toggleRole}
            />
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                successMessage={successMessage}
            />
            <ErrorModal
                isOpen={isErrorModalOpen}
                onClose={() => {
                    setIsErrorModalOpen(false);
                    setErrorMessage(''); // Reset error message on close
                }}
                errorMessage={errorMessage}
            />
        </div>
    );
}

export default UserTable;
