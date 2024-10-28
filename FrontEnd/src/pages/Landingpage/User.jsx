import React from 'react';

const UserLandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome back, User!</h1>
        <p className="mt-2 text-lg text-gray-600">Explore our airline management system.</p>
      </header>
      <main className="max-w-4xl mx-auto px-4">
        <section className="bg-white shadow-md rounded-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
          <ul className="list-disc list-inside">
            <li className="text-lg text-gray-700 mb-2">Book and manage your flights</li>
            <li className="text-lg text-gray-700 mb-2">View your upcoming trips</li>
            <li className="text-lg text-gray-700 mb-2">Manage your account settings</li>
          </ul>
        </section>
        <section className="bg-white shadow-md rounded-md p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Started</h2>
          <p className="text-lg text-gray-700 mb-4">Explore the features and manage your flights efficiently.</p>
          <div className="flex justify-center">          </div>
        </section>
      </main>
      <footer className="text-center py-4 text-gray-600">
        &copy; 2024 Airline Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default UserLandingPage;
