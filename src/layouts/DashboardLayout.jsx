import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ShieldAlert,
  Leaf
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout, logoutAll, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleLogoutAll = async () => {
    await logoutAll();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', to: '/profile', icon: User },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 flex transition-colors duration-200">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-dark-800 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-dark-800">
          <NavLink to="/" className="flex items-center space-x-2 text-xl font-extrabold text-slate-800 dark:text-dark-50">
            <span className="text-primary-600 dark:text-primary-400">🌿</span>
            <span>Plantify</span>
          </NavLink>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-200 dark:border-dark-800 bg-slate-50/50 dark:bg-dark-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-base shadow-inner">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-slate-800 dark:text-dark-100 truncate">{user?.fullName}</h4>
              <p className="text-xs text-slate-400 dark:text-dark-500 truncate">{user?.email}</p>
            </div>
          </div>
          {isAdmin && (
            <div className="mt-2.5 inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/50">
              <ShieldAlert size={10} />
              <span>ADMINISTRATOR</span>
            </div>
          )}
        </div>

        {/* Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400 border-l-4 border-primary-500'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-dark-400 dark:hover:bg-dark-800/60'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-dark-800 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-dark-400 dark:hover:bg-dark-800 transition-colors"
          >
            <span className="flex items-center space-x-3">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </span>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Header Bar */}
        <header className="md:hidden h-16 bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-dark-800 flex items-center justify-between px-6 z-20">
          <NavLink to="/" className="flex items-center space-x-2 text-lg font-bold text-slate-800 dark:text-dark-50">
            <span className="text-primary-600 dark:text-primary-400">🌿</span>
            <span>Plantify</span>
          </NavLink>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-dark-400 dark:hover:bg-dark-800"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {/* Mobile Sidebar overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 flex">
            {/* Background shade */}
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>

            {/* Menu drawer */}
            <div className="relative flex flex-col w-4/5 max-w-sm bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-dark-800 animate-fade-in">
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-dark-800">
                <span className="flex items-center space-x-2 text-lg font-extrabold text-slate-800 dark:text-dark-50">
                  <span>🌿</span>
                  <span>Plantify</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Meta */}
              <div className="p-6 border-b border-slate-200 dark:border-dark-800 bg-slate-50/50 dark:bg-dark-900/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-dark-100">{user?.fullName}</h4>
                    <p className="text-xs text-slate-400 dark:text-dark-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400 border-l-4 border-primary-500'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-dark-400 dark:hover:bg-dark-800'
                        }`
                      }
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="p-6 border-t border-slate-200 dark:border-dark-800 space-y-3">
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-dark-400 dark:hover:bg-dark-800"
                >
                  <span className="flex items-center space-x-3">
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content view portal */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
