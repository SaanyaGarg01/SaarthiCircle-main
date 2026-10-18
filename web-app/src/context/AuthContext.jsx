import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth, login, logout, subscribeToAuthChanges } from '../services/authService';
import storage from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { isAuthenticated: auth, userRole: role } = await checkAuth();
      setIsAuthenticated(auth);
      setUserRole(role);
      if (auth) {
        const profileJson = await storage.getItem('userProfile');
        if (profileJson) setUserProfile(JSON.parse(profileJson));
      }
      setLoading(false);
    };
    init();

    const unsub = subscribeToAuthChanges(async (auth, role) => {
      setIsAuthenticated(auth);
      setUserRole(role);
      if (auth) {
        const profileJson = await storage.getItem('userProfile');
        if (profileJson) setUserProfile(JSON.parse(profileJson));
      } else {
        setUserProfile(null);
      }
    });
    return unsub;
  }, []);

  const doLogin = async (token, role, profile) => {
    await login(token, role, profile);
  };

  const doLogout = async () => {
    await logout();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userProfile, loading, login: doLogin, logout: doLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
