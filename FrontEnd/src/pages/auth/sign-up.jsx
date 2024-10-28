import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Typography, Card } from "@material-tailwind/react";
import { IoMdPerson, IoMdMail, IoMdLock, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link } from "react-router-dom";
import authService from '@/apiservices/authService';
import ErrorModal from '@/pages/Modal/ErrorModal'; // Importez le composant de la boîte de dialogue modale
import SuccessModal from '@/pages/Modal/SuccessModal'; // Importez le composant de la boîte de dialogue modale

export function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Nouvel état pour contrôler l'ouverture de la boîte de dialogue
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;
    if (isSuccessModalOpen) {
      timeout = setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 1500); // Ferme la modal après 1.5 secondes
    }
    return () => clearTimeout(timeout); // Nettoyer le timeout si le composant est démonté
  }, [isSuccessModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation des données
    if (!formData.firstName.trim()) {
      setError('The first name field cannot be blank.');
      setIsErrorModalOpen(true);
      return;
    }
  
    if (!formData.lastName.trim()) {
      setError('The last name field cannot be blank.');
      setIsErrorModalOpen(true);
      return;
    }
  
    if (!formData.email.trim()) {
      setError('The email field cannot be blank.');
      setIsErrorModalOpen(true);
      return;
    }
  
    if (!formData.username.trim()) {
      setError('The username field cannot be blank.');
      setIsErrorModalOpen(true);
      return;
    }
  
    if (!formData.password) {
      setError('The password field cannot be blank.');
      setIsErrorModalOpen(true);
      return;
    }
  
    if (!formData.confirmPassword) {
      setError('The confirm password field cannot be blank.');
      setIsErrorModalOpen(true);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format.');
      setIsErrorModalOpen(true); // Ouvrir la boîte de dialogue d'erreur
      return;
    }
    if (formData.username.length < 3 || formData.username.length > 50) {
      setError('Username must be between 3 and 50 characters long.');
      setIsErrorModalOpen(true); // Ouvrir la boîte de dialogue d'erreur
      return;
    }
    if (formData.password.length < 6 || formData.password.length > 50 || !(/[A-Z]/.test(formData.password)) || !(/[0-9]/.test(formData.password))) {
      setError('Password must be between 6 and 50 characters long, and contain at least one uppercase letter and one digit.');
      setIsErrorModalOpen(true); // Ouvrir la boîte de dialogue d'erreur
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsErrorModalOpen(true); // Ouvrir la boîte de dialogue d'erreur
      return;
    }
    try {
      const response = await authService.register(formData);
      setSuccessMessage(`Congratulations ${formData.username}, Your account has been successfully created !`);
      setIsSuccessModalOpen(true);
      setTimeout(() => navigate('/auth/sign-in'), 2000); // Redirection après le message de succès
    } catch (error) {
      if (error.response) {
        // La requête a été faite et le serveur a répondu avec un statut hors de la plage 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        setError(Object.values(error.response.data).join(" ")); // Affiche les messages d'erreur retournés par le serveur
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.log(error.request);
        setError('The request was not answered.');
      } else {
        // Quelque chose s'est produit lors de la mise en place de la requête qui a déclenché une erreur
        console.log('Error', error.message);
        setError('An error occurred .');
      }
      setIsErrorModalOpen(true);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const closeErrorModal = () => {
    setIsErrorModalOpen(false); // Fermer la boîte de dialogue d'erreur
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/public/img/BG.png)' }}>
      <Card className="w-full max-w-xl py-2 px-8 rounded-lg bg-white bg-opacity-90 shadow-lg">
        <div className="text-center mb-4">
          <img src="/public/img/Logo1.png" alt="Logo" className="mx-auto h-24 w-auto mb-2"/>
          <Typography variant="h2" className="font-bold text-black">Join Us Today</Typography>
        </div>

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4 grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="mb-4 relative col-span-1">
              <Typography variant="small" className="font-medium text-black mb-2">First Name</Typography>
              <div className="relative">
                <IoMdPerson size={24} className="absolute left-0 inset-y-0 my-auto ml-3 text-black" />
                <Input
                  name="firstName"
                  size="lg"
                  placeholder="Your First Name"
                  className="pl-12"
                  onChange={handleChange}
                  value={formData.firstName}
                />
              </div>
            </div>
            {/* Last Name */}
            <div className="mb-4 relative col-span-1">
              <Typography variant="small" className="font-medium text-black mb-2">Last Name</Typography>
              <div className="relative">
                <IoMdPerson size={24} className="absolute left-0 inset-y-0 my-auto ml-3 text-black" />
                <Input
                  name="lastName"
                  size="lg"
                  placeholder="Your Last Name"
                  className="pl-12"
                  onChange={handleChange}
                  value={formData.lastName}
                />
              </div>
            </div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            {/* Email */}
            <div className="mb-4 relative col-span-1">
              <Typography variant="small" className="font-medium text-black mb-2">Email</Typography>
              <div className="relative">
                <IoMdMail size={24} className="absolute left-0 inset-y-0 my-auto ml-3 text-black" />
                <Input
                  name="email"
                  size="lg"
                  placeholder="example@gmail.com"
                  className="pl-12"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
            </div>
            {/* Username */}
            <div className="mb-4 relative col-span-1">
              <Typography variant="small" className="font-medium text-black mb-2">Username</Typography>
              <div className="relative">
                <IoMdPerson size={24} className="absolute left-0 inset-y-0 my-auto ml-3 text-black" />
                <Input
                  name="username"
                  size="lg"
                  placeholder="Your Username"
                  className="pl-12"
                  onChange={handleChange}
                  value={formData.username}
                />
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            {/* Password Input */}
            <div className="mb-4 relative col-span-1">
              <Typography variant="small" className="font-medium text-black mb-2">Password</Typography>
              <div className="relative">
                <IoMdLock size={24} className="absolute left-0 inset-y-0 my-auto ml-3 text-black" />
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  size="lg"
                  placeholder="********"
                  className="pl-12"
                  onChange={handleChange}
                  value={formData.password}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                  {showPassword ? (
                    <IoMdEyeOff size={24} onClick={toggleShowPassword} className="cursor-pointer" />
                  ) : (
                    <IoMdEye size={24} onClick={toggleShowPassword} className="cursor-pointer" />
                  )}
                </div>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-4 relative col-span-1">
              <Typography variant="small" className="font-medium text-black mb-2">Confirm Password</Typography>
              <div className="relative">
                <IoMdLock size={24} className="absolute left-0 inset-y-0 my-auto ml-3 text-black" />
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  size="lg"
                  placeholder="********"
                  className="pl-12"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                  {showConfirmPassword ? (
                    <IoMdEyeOff size={24} onClick={toggleShowConfirmPassword} className="cursor-pointer" />
                  ) : (
                    <IoMdEye size={24} onClick={toggleShowConfirmPassword} className="cursor-pointer" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="mb-4" fullWidth>Register Now</Button>

          <div className="relative flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4">Or</span>
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
            Already have an account?
            <Link to="/auth/sign-in" className=" font-medium text-blue-900 ml-1">Sign in</Link>
          </Typography>
        </form>
      </Card>

      <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} successMessage={successMessage}/>

      <ErrorModal isOpen={isErrorModalOpen} onClose={closeErrorModal} errorMessage={error} />
    </section>
  );
}

export default SignUp;










