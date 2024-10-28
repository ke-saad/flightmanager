import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Input, Button, Typography, Card } from "@material-tailwind/react";
import { IoMdLock, IoMdEye, IoMdEyeOff } from "react-icons/io";
import authService from '@/apiservices/authService';
import ErrorModal from '@/pages/Modal/ErrorModal';
import SuccessModal from '@/pages/Modal/SuccessModal';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Password cannot be blank.');
      setIsErrorModalOpen(true);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsErrorModalOpen(true);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsErrorModalOpen(true);
      return;
    }

    try {
      const response = await authService.resetPassword(token, password);
      setSuccessMessage(response.data || 'Your password has been successfully reset.');
      setIsSuccessModalOpen(true);
      setTimeout(() => navigate('/auth/sign-in'), 2000);
    } catch (error) {
      const errorMessage = error.response ? error.response.data : 'Failed to reset password';
      setError(errorMessage);
      setIsErrorModalOpen(true);
    }
  };

  const validatePassword = (password) => {
    const lengthRegex = /^.{6,100}$/;
    const contentRegex = /^(?=.*[A-Z])(?=.*\d)/;
  
    if (!lengthRegex.test(password)) {
      return 'Password is too short.';
    }
  
    if (!contentRegex.test(password)) {
      return 'Password must contain at least one uppercase letter and one digit.';
    }
  
    return '';
  };
  
  

  return (
    <section className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/public/img/BG.png)' }}>
      <Card className="w-full max-w-md p-8 rounded-lg bg-white bg-opacity-90 shadow-lg">
        <Typography variant="h2" className="text-center text-black font-bold mb-4">Reset Password</Typography>
        <Typography variant="paragraph" className="text-center mb-8">
          Enter your new password below.
        </Typography>
        <div className="mb-4 relative">
          <IoMdLock size={24} className="absolute left-0 inset-y-0 my-auto ml-3 text-black" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="New password"
            onChange={handlePasswordChange}
            value={password}
            size="lg"
            className="pl-12 pr-10"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {showPassword ? (
              <IoMdEyeOff size={24} onClick={toggleShowPassword} className="cursor-pointer text-gray-400" />
            ) : (
              <IoMdEye size={24} onClick={toggleShowPassword} className="cursor-pointer text-gray-400" />
            )}
          </div>
        </div>
        <div className="mb-4 relative">
          <IoMdLock size={24} className="absolute left-0 inset-y-0 my-auto ml-3 text-black" />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            onChange={handleConfirmPasswordChange}
            value={confirmPassword}
            size="lg"
            className="pl-12 pr-10"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {showConfirmPassword ? (
              <IoMdEyeOff size={24} onClick={toggleShowConfirmPassword} className="cursor-pointer text-gray-400" />
            ) : (
              <IoMdEye size={24} onClick={toggleShowConfirmPassword} className="cursor-pointer text-gray-400" />
            )}
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-full mb-4">
          Reset Password
        </Button>
        <Link to="/auth/sign-in" className="text-center font-medium text-blue-900">Back to Sign In</Link>
      </Card>
      <ErrorModal isOpen={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)} errorMessage={error} />
      <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} successMessage={successMessage} />
    </section>
  );
}

export default ResetPassword;
