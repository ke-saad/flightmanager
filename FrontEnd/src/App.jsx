import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, Auth } from '@/layouts';
import { AuthContext } from './context/AuthContext.jsx';
import ResetPassword from './pages/auth/ResetPassword';
import LandingPage from './pages/LandingPage/guest';
import UserLandingPage from './pages/LandingPage/user'; // Assurez-vous que l'import est correct

export const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { authState } = useContext(AuthContext);
  const roleMatch = authState.roles.some(role => allowedRoles.includes(role));
  if (!authState.isAuthenticated || !roleMatch) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  return children;
};

function App() {
  //const { authState, loading } = useContext(AuthContext);

  //if (loading) {
  //  return <div>Loading...</div>; // Afficher un chargement ou tout autre indicateur pendant le chargement
  //}

  //if (!authState.isAuthenticated) {
  //  return <Navigate to="/auth/sign-in" replace />;
 // }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} /> {/* Page d'accueil pour les invités */}
      <Route path="/dashboard/*" element={<RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}><Dashboard /></RoleProtectedRoute>} />
      <Route path="/user-landing" element={<RoleProtectedRoute allowedRoles={['ROLE_USER']}><UserLandingPage /></RoleProtectedRoute>} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
