import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800">Airline Management System</h1>
        <p className="mt-2 text-lg text-gray-600">Welcome to our airline management platform</p>
      </header>
      <main className="max-w-4xl mx-auto px-4">
        <section className="bg-white shadow-md rounded-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
          <ul className="list-disc list-inside">
            <li className="text-lg text-gray-700 mb-2">Flight booking and management</li>
            <li className="text-lg text-gray-700 mb-2">Passenger management</li>
            <li className="text-lg text-gray-700 mb-2">Staff and crew management</li>
            <li className="text-lg text-gray-700 mb-2">Inventory and asset management</li>
          </ul>
        </section>
        <section className="bg-white shadow-md rounded-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Started</h2>
          <p className="text-lg text-gray-700 mb-4">Sign up or log in to start managing your airline efficiently.</p>
          <div className="flex justify-center">
            <Link to="/auth/sign-up" className="mr-4 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">Sign Up</Link>
            <Link to="/auth/sign-in" className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-300">Log In</Link>
          </div>
        </section>
      </main>
      <footer className="text-center py-4 text-gray-600">
        &copy; 2024 Airline Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
