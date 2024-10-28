import React, { useState } from 'react';
import { Input, Button, Typography, Card } from "@material-tailwind/react";
import { IoMail } from "react-icons/io5";
import { Link } from "react-router-dom";
import authService from '@/apiservices/authService'; 
import SuccessModal from '@/pages/Modal/SuccessModal'; 
import ErrorModal from '@/pages/Modal/ErrorModal'; 

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleResetPassword();
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setErrorMessage('The email field cannot be blank.');
      setIsErrorModalOpen(true);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Invalid email format.');
      setIsErrorModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      setSuccessMessage("Reset password link sent to: " + email);
      setIsSuccessModalOpen(true);
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Email not found.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const closeSuccessModal = () => setIsSuccessModalOpen(false);
  const closeErrorModal = () => setIsErrorModalOpen(false);

  return (
    <section className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/public/img/BG.png)' }}>
      <Card className="w-full max-w-md p-8 rounded-lg bg-white bg-opacity-90 shadow-lg">
      <form onSubmit={handleSubmit} noValidate> 
        <Typography variant="h2" className="text-center text-black font-bold mb-4">Forgot Password</Typography>
        <Typography variant="paragraph" className="text-center mb-8">
          Enter your email address and we will send you a link to reset your password.
        </Typography>
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoMail size={24} className="text-black" />
          </div>
          <Input
            type="email"
            placeholder="Enter your email"
            onChange={handleEmailChange}
            value={email}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="w-full mb-4" disabled={isLoading}> 
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
        {isLoading && <Typography variant="small" className="text-center text-black font-bold">Please wait, sending reset instructions...</Typography>}
      </form>
        <Link to="/auth/sign-in" className="text-center font-medium text-blue-900">Back to Sign In</Link>
      </Card>
      <SuccessModal isOpen={isSuccessModalOpen} onClose={closeSuccessModal} successMessage={successMessage}/>
      <ErrorModal isOpen={isErrorModalOpen} onClose={closeErrorModal} errorMessage={errorMessage}/>
    </section>
  );
}

export default ForgotPassword;
