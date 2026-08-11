import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('plantify_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('plantify_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (emailOrMobile, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ emailOrMobile, password });
      if (res.success && res.data) {
        const authData = res.data;
        const userData = {
          userId: authData.userId,
          username: authData.username,
          email: authData.email,
          fullName: authData.fullName,
          role: authData.role,
        };
        setToken(authData.token);
        setUser(userData);
        localStorage.setItem('plantify_token', authData.token);
        localStorage.setItem('plantify_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await authApi.register(formData);
      if (res.success && res.data) {
        const authData = res.data;
        const userData = {
          userId: authData.userId,
          username: authData.username,
          email: authData.email,
          fullName: authData.fullName,
          role: authData.role,
        };
        setToken(authData.token);
        setUser(userData);
        localStorage.setItem('plantify_token', authData.token);
        localStorage.setItem('plantify_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (emailOrMobile, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ emailOrMobile, password });
      if (res.success && res.data) {
        const authData = res.data;
        if (authData.role !== 'ADMIN') {
          return {
            success: false,
            message: 'This login is for administrators only. Please use the regular login page.'
          };
        }
        const userData = {
          userId: authData.userId,
          username: authData.username,
          email: authData.email,
          fullName: authData.fullName,
          role: authData.role,
        };
        setToken(authData.token);
        setUser(userData);
        localStorage.setItem('plantify_token', authData.token);
        localStorage.setItem('plantify_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore logout errors
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('plantify_token');
      localStorage.removeItem('plantify_user');
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, loading, login, loginAdmin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
