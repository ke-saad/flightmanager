import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Input, Button, Typography, Card } from "@material-tailwind/react";
import { IoMdPerson, IoMdLock, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link } from "react-router-dom";
import { AuthContext } from '@/context/AuthContext';
import authService from '@/apiservices/authService'; 
import ErrorModal from '@/pages/Modal/ErrorModal'; 
import SuccessModal from '@/pages/Modal/SuccessModal'; 

export function SignIn() {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); 
  const { authState, login } = useContext(AuthContext);
  const navigate = useNavigate(); 
  const toggleShowPassword = () => setShowPassword(!showPassword);

 
  useEffect(() => {
    let timeout;
    if (isSuccessModalOpen) {
      timeout = setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 1500); 
    }
    return () => clearTimeout(timeout); 
  }, [isSuccessModalOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Username cannot be blank.');
      setIsErrorModalOpen(true);
      return;
    }
  
    if (!password.trim()) {
      setError('Password cannot be blank.');
      setIsErrorModalOpen(true);
      return;
    }
    try {
      const response = await authService.login({ username, password });
      login(response.data.token, response.data.roles,response.data.username);
      
      // Redirection en fonction du rôle de l'utilisateur
      if (response.data.roles.includes('ROLE_ADMIN')) {
        navigate('/dashboard/home');
      } else if (response.data.roles.includes('ROLE_USER')) {
        navigate('/user-landing');
      }

    } catch (error) {
      setError('Password or username incorrect.');
      setIsErrorModalOpen(true);
    }
  };
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  };



  const closeErrorModal = () => {
    setIsErrorModalOpen(false); 
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };
  return (
    <section className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/public/img/BG.png)' }}>
      <Card className="w-full max-w-md p-8 rounded-lg bg-white bg-opacity-90 shadow-lg">
        <div className="text-center mb-8">
          <img src="/public/img/Logo1.png" alt="Logo" className="mx-auto h-24 w-auto mb-4"/>
          <Typography variant="h2" className="font-medium text-black mb-2">Sign In</Typography>
        </div>

        <form className="w-full" onKeyPress={handleKeyPress}>
          <div className="mb-4 relative">
            <Typography variant="small" className="font-medium text-black mb-2">Username</Typography>
            <div className="relative">
              <IoMdPerson size={24} className="absolute left-0 inset-y-0 my-auto ml-3 text-black" />
             <Input
              id="username"
              name="username"
              size="lg"
              placeholder="username"
              className="pl-12"
              value={username}
              onChange={handleInputChange}
            />
            </div>
          </div>
          <div className="mb-4 relative">
            <Typography variant="small" className="font-medium text-black mb-2">Password</Typography>
            <div className="relative">
              <IoMdLock size={24} className="absolute left-0 inset-y-0 my-auto ml-3 text-black" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              size="lg"
              placeholder="********"
              className="pl-12"
              value={password}
              onChange={handleInputChange}
            />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showPassword ? (
                  <IoMdEyeOff size={24} onClick={toggleShowPassword} className="cursor-pointer text-gray-400" />
                ) : (
                  <IoMdEye size={24} onClick={toggleShowPassword} className="cursor-pointer text-gray-400" />
                )}
              </div>
            </div>
          </div>
          <div className="text-right mb-6">
            <Typography variant="small" className="font-medium text-black">
              <Link to="/auth/forgot-password" className="transition-colors hover:text-black text-blue-900" >
                Forgot Password
              </Link>
            </Typography>
          </div>
          
          <Button onClick={handleLogin} className="mb-4" fullWidth> Sign In </Button>

          <div className="relative flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <Typography variant="small" className="px-4 bg-white text-center">
              Or
            </Typography>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md mb-4" fullWidth>
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1156_824)">
                <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
              </g>
              <defs>
                <clipPath id="clip0_1156_824">
                  <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                </clipPath>
              </defs>
            </svg>
            <span>Sign in With Google</span>
          </Button>

          <Typography variant="paragraph" className="text-center text-black font-medium">
            Not registered?
            <Link to="/auth/sign-up" className="text-blue-900 font-medium ml-1">Create account</Link>
          </Typography>

        </form>
      </Card>
      <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} successMessage={successMessage}/>
      <ErrorModal isOpen={isErrorModalOpen} onClose={closeErrorModal} errorMessage={error} /> {/* Afficher la boîte de dialogue modale en cas d'erreur */}
    </section>
  );
}

export default SignIn;
