import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    username: null,
    roles: [],
    isAuthenticated: false
  });
  const [loading, setLoading] = useState(true); // Ajout d'un état de chargement

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const roles = JSON.parse(localStorage.getItem('userRoles'));
    if (token && roles) {
      setAuthState({ token, roles, isAuthenticated: true });
    }
    setLoading(false); // Définir le chargement sur false une fois le chargement terminé
  }, []);

  const login = (token, roles,username) => {
    localStorage.setItem('username',username);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRoles', JSON.stringify(roles));
    setAuthState({ token, roles, username, isAuthenticated : true });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRoles');
    setAuthState({ token: null, roles: [], isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
