import axios from 'axios';

// Assurez-vous que votre fichier .env contient une variable nommée VITE_REACT_APP_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Added JWT token to headers');
    } else {
      console.log('No JWT token found in localStorage');
    }
    return config;
  },
  error => {
    console.error('Error in request setup:', error);
    return Promise.reject(error);
  }
);


export default axiosInstance;
