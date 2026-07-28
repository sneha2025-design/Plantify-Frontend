import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);

  const clearSessionTimeout = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
  };

  const resetSessionTimeout = () => {
    clearSessionTimeout();
    if (user) {
      logoutTimerRef.current = setTimeout(() => {
        handleAutomaticLogout();
      }, INACTIVITY_TIMEOUT);
    }
  };

  const handleAutomaticLogout = async () => {
    toast('Session expired due to inactivity. Logging out...', {
      icon: '🕒',
      duration: 5000,
    });
    await logout();
  };

  // Activity listeners to track user presence
  useEffect(() => {
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetSessionTimeout();
    };

    if (user) {
      resetSessionTimeout();
      activityEvents.forEach((event) => {
        window.addEventListener(event, handleActivity);
      });
    }

    return () => {
      clearSessionTimeout();
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user]);

  // Initial user fetch (auto-login if accessToken is stored)
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to restore authentication session:', error);
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for global logout events (broadcast from Axios interceptor)
    const handleGlobalLogout = () => {
      setUser(null);
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('auth-logout', handleGlobalLogout);
    return () => {
      window.removeEventListener('auth-logout', handleGlobalLogout);
    };
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      setUser(data);
      toast.success(`Welcome back, ${data.fullName}! 🌿`);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      toast.success(data.message || 'Registration complete! Check your email for OTP.');
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const verifyOtp = async (otpData) => {
    try {
      const data = await authService.verifyOtp(otpData);
      toast.success(data.message || 'OTP verified successfully!');
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const resendOtp = async (resendData) => {
    try {
      const data = await authService.resendOtp(resendData);
      toast.success(data.message || 'A new verification OTP has been sent to your email.');
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      toast.success('Logged out successfully. See you soon! 👋');
    } catch (error) {
      setUser(null);
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logoutAll = async () => {
    setLoading(true);
    try {
      await authService.logoutAll();
      setUser(null);
      toast.success('Logged out from all devices successfully.');
    } catch (error) {
      setUser(null);
      console.error('Logout all error:', error);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (forgotData) => {
    try {
      const data = await authService.forgotPassword(forgotData);
      toast.success(data.message || 'Password reset link sent to email.');
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to request password reset. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const resetPassword = async (resetData) => {
    try {
      const data = await authService.resetPassword(resetData);
      toast.success(data.message || 'Password has been reset successfully!');
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const changePassword = async (changePasswordData) => {
    try {
      const data = await authService.changePassword(changePasswordData);
      setUser(null); // Force logout on password change
      toast.success(data.message || 'Password changed successfully. Please log in again.');
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed.';
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        logoutAll,
        register,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        changePassword,
        isAuthenticated: !!user,
        isAdmin: user?.roles?.includes('ROLE_ADMIN'),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
