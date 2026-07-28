import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import SkeletonCard from '../components/SkeletonCard';
import Button from '../components/Button';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Shield, 
  CheckCircle2, 
  Key,
  Leaf
} from 'lucide-react';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user: contextUser, logoutAll } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getCurrentUser();
        setProfileData(data);
      } catch (err) {
        console.error('Failed to load user profile:', err);
        toast.error('Failed to retrieve profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogoutAll = async () => {
    if (window.confirm('Are you sure you want to log out from all devices? This will invalidate all active login sessions.')) {
      setLogoutLoading(true);
      try {
        await logoutAll();
        navigate('/login');
      } catch (err) {
        console.error('Failed to terminate all sessions:', err);
      } finally {
        setLogoutLoading(false);
      }
    };
  };

  if (loading) {
    return (
      <div className="space-y-6 text-left">
        <div className="h-8 bg-slate-200 dark:bg-dark-800 rounded w-1/4 animate-pulse"></div>
        <div className="grid md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const user = profileData || contextUser;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="space-y-8 text-left animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800/60 p-8 rounded-2xl shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute right-[-10%] top-[-30%] w-60 h-60 bg-primary-300/10 dark:bg-primary-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-primary-650 dark:text-primary-400">
            <Leaf size={14} />
            <span>Member Space</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-dark-50">
            Welcome, {user?.fullName}! 🌿
          </h1>
          <p className="text-sm text-slate-400 dark:text-dark-500">
            Manage your account credentials, sessions, and preferences from this panel.
          </p>
        </div>

        <div className="flex space-x-3 shrink-0">
          <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
            Edit Profile
          </Button>
          <Button variant="danger" size="sm" isLoading={logoutLoading} onClick={handleLogoutAll}>
            <Key size={14} className="mr-1.5" />
            Logout All Devices
          </Button>
        </div>
      </div>

      {/* Account Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800/60 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-dark-100 text-lg border-b border-slate-100 dark:border-dark-800 pb-3 flex items-center space-x-2">
            <User size={18} className="text-primary-600 dark:text-primary-400" />
            <span>Profile Information</span>
          </h3>
          <div className="space-y-3.5 text-sm">
            <div className="flex items-center space-x-3 text-slate-600 dark:text-dark-350">
              <Mail size={16} className="text-slate-400" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address</span>
                <span className="font-semibold text-slate-800 dark:text-dark-100">{user?.email}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-slate-600 dark:text-dark-350">
              <Phone size={16} className="text-slate-400" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Phone Number</span>
                <span className="font-semibold text-slate-800 dark:text-dark-100">{user?.phoneNumber}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-slate-600 dark:text-dark-350">
              <User size={16} className="text-slate-400" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Username</span>
                <span className="font-semibold text-slate-800 dark:text-dark-100">@{user?.username}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Access Card */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800/60 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-dark-100 text-lg border-b border-slate-100 dark:border-dark-800 pb-3 flex items-center space-x-2">
            <Shield size={18} className="text-primary-600 dark:text-primary-400" />
            <span>Security &amp; Status</span>
          </h3>
          <div className="space-y-3.5 text-sm">
            <div className="flex items-center space-x-3 text-slate-600 dark:text-dark-350">
              <CheckCircle2 size={16} className="text-slate-400" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Verification</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${user?.isVerified ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300' : 'bg-red-100 text-red-800'}`}>
                  {user?.isVerified ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-slate-600 dark:text-dark-350">
              <Clock size={16} className="text-slate-400" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Last Login Attempt</span>
                <span className="font-semibold text-slate-800 dark:text-dark-100">{formatDate(user?.lastLogin)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-slate-600 dark:text-dark-350">
              <Calendar size={16} className="text-slate-400" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Member Since</span>
                <span className="font-semibold text-slate-800 dark:text-dark-100">{formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
