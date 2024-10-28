import React from 'react';

function BookingModal({ isOpen, onClose, formData, onFormChange, onSubmit, isNewBooking, handleFormValidationError }) {
    return (
        <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
            <div className="modal-container bg-white w-1/2 mx-auto mt-20 p-4 rounded-lg shadow-lg">
                <div className="modal-header">
                    <button className="modal-close" onClick={onClose}>
                        <span className="sr-only">Close</span>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {/* Formulaire de réservation */}
                </div>
                <div className="modal-footer">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onSubmit}>
                        {isNewBooking ? 'Add Booking' : 'Update Booking'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookingModal;
