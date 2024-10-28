import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const AircraftModal = ({
    isOpen,
    onClose,
    formData,
    onFormChange,
    onSubmit,
    isNewAircraft, // Boolean to determine if it's a new aircraft or modification
    handleFormValidationError // This is the new prop for handling form validation errors
}) => {
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent form from submitting traditionally
    
        // Check if any required field is empty
        if (Object.values(formData).some(value => value === '')) {
            handleFormValidationError('All fields are required.');
            return; // Stop the submission process
        }
    
        // If all fields are filled, proceed to call the onSubmit
        onSubmit();
    };
    
// In AircraftTable or similar parent component
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);

      return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setIsEditModalOpen(false)}>
                <div className="flex items-center justify-center min-h-screen">
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                    <Transition.Child
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-lg p-6 rounded-lg shadow-lg transform transition-all relative" style={{ backgroundImage: `url(/public/img/01.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            <div className="bg-white p-6 rounded shadow" style={{ maxWidth: '500px' }}>
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-center">
                                    {isNewAircraft ? 'Add New Aircraft' : 'Edit Aircraft Details'}
                                </Dialog.Title>
                                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                    {['model', 'registrationNumber', 'seatingCapacity', 'status'].map((field, index) => (
                                        <div key={index} className="grid grid-cols-3 gap-2 items-center">
                                            <label htmlFor={field} className="col-span-1 text-left text-sm font-semibold">
                                                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}:
                                            </label>
                                            {field !== 'status' ? (
                                                <input
                                                    type={field === 'seatingCapacity' ? 'number' : 'text'}
                                                    name={field}
                                                    id={field}
                                                    value={formData[field]}
                                                    onChange={onFormChange}
                                                    className="col-span-2 p-2 border rounded w-full"
                                                    placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}`}
                                                />
                                            ) : (
                                                <select
                                                    name="status"
                                                    id="status"
                                                    value={formData.status}
                                                    onChange={onFormChange}
                                                    className="col-span-2 p-2 border rounded w-full"
                                                >   
                                                    <option>Select Status</option>
                                                    <option value="ACTIVE">ACTIVE</option>
                                                    <option value="MAINTENANCE">MAINTENANCE</option>
                                                    <option value="DECOMMISSIONED">DECOMMISSIONED</option>
                                                    <option value="RESERVED">RESERVED</option>
                                                </select>
                                            )}
                                        </div>
                                    ))}
                                    <div className="flex justify-between mt-5">
                                        <button type="button" onClick={onClose} className="flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded shadow-lg text-sm">
                                            <XCircleIcon className="h-4 w-4 mr-1" />
                                            Cancel
                                        </button>
                                        <button type="submit" className="flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-bold rounded shadow-lg text-sm">
                                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AircraftModal;