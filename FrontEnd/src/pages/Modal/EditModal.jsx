// EditModal.jsx

import React from 'react';
import { Dialog, Transition, Switch } from '@headlessui/react';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid'; 

const EditModal = ({
    isOpen,
    onClose,
    formData,
    onFormChange,
    onSubmit,
    toggleRole,
    isRoleAdmin,
    
}) => (
    
    <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setIsEditModalOpen(false)}>
            <div className="flex items-center justify-center min-h-screen">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel className="w-full max-w-lg p-6 rounded-lg shadow-lg transform transition-all relative" style={{ backgroundImage: `url(/public/img/01.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <div className="bg-white p-6 rounded shadow" style={{ maxWidth: '500px' }}>
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 p-3 rounded text-center">
                                Editer Utilisateur
                            </Dialog.Title>
                            <form onSubmit={onSubmit} className="space-y-4 mt-4">
                                {['email', 'firstName', 'lastName', 'username'].map((field, index) => (
                                    <div key={index} className="grid grid-cols-3 gap-2 items-center">
                                        <label htmlFor={field} className="text-left text-sm font-semibold col-span-1">
                                            {field === 'firstName' ? 'Prénom' : 
                                            field === 'lastName' ? 'Nom' : 
                                            field === 'email' ? 'Email' : 'Username'}:
                                        </label>
                                        <input
                                            type="text"
                                            name={field}
                                            id={field}
                                            value={formData[field]}
                                            onChange={onFormChange}
                                            className="p-2 border rounded w-full col-span-2"
                                        />
                                    </div>
                                ))}
                                <div className="grid grid-cols-3 gap-2 items-center">
                                    <label htmlFor="roleToggle" className="text-left text-sm font-semibold col-span-1">
                                        Rendre Admin:
                                    </label>
                                    <Switch
                                        checked={isRoleAdmin}
                                        onChange={toggleRole}
                                        className={`${isRoleAdmin ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none col-span-2`}
                                    >
                                        <span
                                            className={`${isRoleAdmin ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                        />
                                    </Switch>
                                </div>
                                <div className="flex justify-between mt-5 space-x-">
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

export default EditModal;
