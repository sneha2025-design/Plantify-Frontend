import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import router from './routes';

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* React Hot Toast Notifications Container */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1e293b',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0',
              padding: '12px 18px',
              fontFamily: '"Inter", sans-serif',
              fontSize: '14px',
            },
            success: {
              style: {
                borderLeft: '4px solid #16a34a',
              },
            },
            error: {
              style: {
                borderLeft: '4px solid #dc2626',
              },
            },
          }}
        />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
