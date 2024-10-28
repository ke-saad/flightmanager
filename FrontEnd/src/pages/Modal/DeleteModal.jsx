import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const DeleteModal = ({ isOpen, onClose, onConfirm }) => (
    <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
            <div className="flex items-center justify-center min-h-screen">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg transform transition-all">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-2" />
                            Are you sure you want to delete this user?
                        </Dialog.Title>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                This action cannot be undone. This will permanently delete the user from your database.
                            </p>
                        </div>
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                type="button"
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={onConfirm}
                            >
                                Yes, delete it!
                            </button>
                            <button
                                type="button"
                                className="w-full bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </div>
        </Dialog>
    </Transition>
);

export default DeleteModal;
