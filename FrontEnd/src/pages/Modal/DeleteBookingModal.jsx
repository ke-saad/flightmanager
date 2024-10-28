import React from 'react';

function DeleteBookingModal({ isOpen, onClose, onConfirm }) {
    return (
        <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
            <div className="modal-container bg-white w-1/3 mx-auto mt-20 p-4 rounded-lg shadow-lg">
                <div className="modal-header">
                    <button className="modal-close" onClick={onClose}>
                        <span className="sr-only">Close</span>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to delete this booking?</p>
                </div>
                <div className="modal-footer">
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteBookingModal;
