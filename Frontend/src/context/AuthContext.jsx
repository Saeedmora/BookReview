import React, { useContext, createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem('userData');
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (token && !userData) {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    }
  }, [userData]);

  const updateUserData = (newUserData) => {
    setUserData(newUserData);
    localStorage.setItem('userData', JSON.stringify(newUserData));
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/login',
        { email, password },
        { withCredentials: true }
      );
      setUserData(response.data);
      localStorage.setItem('userData', JSON.stringify(response.data));
      Cookies.set('token', response.data.token, { expires: 1 });
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/logout',
        {},
        { withCredentials: true }
      );
      setUserData(null);
      localStorage.removeItem('userData');
      Cookies.remove('token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/register',
        { username, email, password },
        { withCredentials: true }
      );
      setUserData(response.data);
      localStorage.setItem('userData', JSON.stringify(response.data));
      Cookies.set('token', response.data.token, { expires: 1 });
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  };

  const values = {
    userData,
    updateUserData,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContext;
