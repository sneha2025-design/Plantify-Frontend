import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const AuthLayout = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-dark-950 transition-colors duration-200">
      
      {/* Theme Toggle Button top right */}
      <div className="absolute top-4 right-4 z-55">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 text-slate-500 dark:text-dark-400 hover:bg-slate-100 dark:hover:bg-dark-800 shadow-sm transition-all"
        >
          {theme === 'dark' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
        </button>
      </div>

      {/* Decorative Side Panel (Desktop only) */}
      <div className="hidden md:flex md:w-5/12 plant-gradient text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Soft floating circles for abstract premium vibe */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-green-400/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div>
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-extrabold tracking-wide">
            <span>🌿</span>
            <span>Plantify</span>
          </Link>
        </div>

        <div className="space-y-6 max-w-sm">
          <h1 className="text-4xl font-extrabold leading-tight">
            Grow your perfect sanctuary.
          </h1>
          <p className="text-emerald-100/90 text-sm leading-relaxed">
            Discover a curated collection of indoor & outdoor plants to purify your air, elevate your interior aesthetics, and bring nature closer to your home.
          </p>
        </div>

        <div className="text-xs text-emerald-200/60">
          &copy; 2026 Plantify Inc. All rights reserved.
        </div>
      </div>

      {/* Card Content Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        {/* Mobile Logo */}
        <div className="absolute top-4 left-6 md:hidden">
          <Link to="/" className="inline-flex items-center space-x-1.5 text-lg font-bold text-slate-800 dark:text-dark-50">
            <span>🌿</span>
            <span className="font-extrabold font-sans">Plantify</span>
          </Link>
        </div>

        <div className="w-full max-w-md animate-fade-in">
          <div className="glass dark:glass border border-slate-200/50 dark:border-dark-800/40 p-8 rounded-2xl shadow-xl bg-white/70 dark:bg-dark-900/60">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
