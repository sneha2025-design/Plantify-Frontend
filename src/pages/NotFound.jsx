import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950 p-6 transition-colors duration-200">
      <div className="w-full max-w-md animate-fade-in text-center">
        <div className="glass border border-slate-200/50 dark:border-dark-800/40 p-8 rounded-2xl shadow-xl bg-white/70 dark:bg-dark-900/60 space-y-6">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-950/40 text-primary-650 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <AlertCircle size={32} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-dark-50">404 - Not Found</h1>
            <p className="text-sm text-slate-500 dark:text-dark-400 leading-relaxed">
              Oops! The page you are looking for does not exist or has been relocated to another address.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-primary-655 hover:bg-primary-755 text-white font-semibold px-5 py-2.5 rounded-lg text-sm shadow-sm transition-all"
            >
              <ArrowLeft size={16} />
              <span>Go to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
