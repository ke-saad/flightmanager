import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const FlightModal = ({
    isOpen,
    onClose,
    formData,
    onFormChange,
    onSubmit,
    isNewFlight,
    handleFormValidationError,
    airports,  // Pass airports data as prop
    aircrafts  // Pass aircrafts data as prop
}) => {
    const [aircraftError, setAircraftError] = useState('');

    const validateAircraft = (aircraftId) => {
        const aircraft = aircrafts.find(a => Number(a.id) === Number(aircraftId));
        console.log("Aircraft Found:", aircraft); // Ensure we are getting the correct aircraft
        return aircraft ? aircraft.status : null; // Return the status or null if not found
    };
    
    
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Form Data on Submit:", formData); // Verify the form data submitted
    
        if (Object.values(formData).some(value => value === '')) {
            handleFormValidationError('All fields are required.');
            return;
        }
    
        // Validate aircraft status
        const aircraftStatus = validateAircraft(formData.aircraftId);
        if (aircraftStatus !== 'ACTIVE') {
            const statusMessage = aircraftStatus ? `The aircraft is currently marked as '${aircraftStatus}'. Only active aircrafts can be assigned to flights.` : 'No aircraft found with the given ID.';
            console.log("Aircraft validation failed. Status:", aircraftStatus); // Logging the status for debug
            handleFormValidationError(statusMessage);
            return;
        }
    
        onSubmit();
    };
    
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
                                    {isNewFlight ? 'Add New Flight' : 'Edit Flight Details'}
                                </Dialog.Title>
                                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                    {['airline', 'departureTime', 'arrivalTime', 'price'].map((field, index) => (
                                        <div key={index} className="grid grid-cols-3 gap-2 items-center">
                                            <label htmlFor={field} className="col-span-1 text-left text-sm font-semibold">
                                                {field.replace(/([A-Z])/g, ' $1').trim()}:
                                            </label>
                                            <input
                                                type={field.includes('Time') ? 'datetime-local' : 'text'}
                                                name={field}
                                                id={field}
                                                value={formData[field]}
                                                onChange={onFormChange}
                                                className="col-span-2 p-2 border rounded w-full"
                                                placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim()}`}
                                            />
                                        </div>
                                    ))}
                                    {['originId', 'destinationId', 'aircraftId'].map((field, index) => (
                                        <div key={index} className="grid grid-cols-3 gap-2 items-center">
                                            <label htmlFor={field} className="col-span-1 text-left text-sm font-semibold">
                                                {field.replace('Id', '').charAt(0).toUpperCase() + field.replace('Id', '').slice(1)}:
                                            </label>
                                            <select
                                                name={field}
                                                id={field}
                                                value={formData[field]}
                                                onChange={onFormChange}
                                                className="col-span-2 p-2 border rounded w-full"
                                            >
                                                <option value="">Select {field.replace('Id', '')}</option>
                                                {(field === 'originId' || field === 'destinationId' ? airports : aircrafts).map(option => (
                                                    <option key={option.id} value={option.id}>{option.city || option.model}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                    {aircraftError && (
                                        <div className="text-red-500 text-center p-2">
                                            {aircraftError}
                                        </div>
                                    )}
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

export default FlightModal;
