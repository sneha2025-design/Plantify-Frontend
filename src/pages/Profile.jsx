import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import authService from '../services/authService';
import SkeletonCard from '../components/SkeletonCard';
import { User, Mail, Phone, ShieldCheck, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user: contextUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <SkeletonCard />;
  }

  const user = profileData || contextUser;

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-dark-50">My Profile</h1>
        <p className="text-sm text-slate-400 dark:text-dark-500">View your basic account profile credentials.</p>
      </div>

      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800/60 rounded-2xl shadow-sm overflow-hidden">
        {/* Top Accent Strip */}
        <div className="h-24 plant-gradient relative"></div>

        {/* User Info Wrapper */}
        <div className="p-6 relative pt-0">
          
          {/* Avatar Spaced Absolute */}
          <div className="absolute top-[-36px] left-6">
            <div className="w-18 h-18 rounded-full border-4 border-white dark:border-dark-900 bg-primary-100 dark:bg-primary-950 text-primary-750 dark:text-primary-300 flex items-center justify-center font-black text-2xl shadow-md">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="pt-12 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-800 dark:text-dark-50">{user?.fullName}</h2>
              <span className="text-xs font-semibold text-slate-400 dark:text-dark-500">Member Space Account</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-dark-800">
              
              <div className="flex items-center space-x-3.5">
                <div className="p-2 bg-slate-50 dark:bg-dark-950/60 rounded-lg text-slate-400">
                  <User size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Username</span>
                  <span className="font-semibold text-sm text-slate-800 dark:text-dark-100">@{user?.username}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="p-2 bg-slate-50 dark:bg-dark-950/60 rounded-lg text-slate-400">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                  <span className="font-semibold text-sm text-slate-800 dark:text-dark-100">{user?.email}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="p-2 bg-slate-50 dark:bg-dark-950/60 rounded-lg text-slate-400">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</span>
                  <span className="font-semibold text-sm text-slate-800 dark:text-dark-100">{user?.phoneNumber || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="p-2 bg-slate-50 dark:bg-dark-950/60 rounded-lg text-slate-400">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Role</span>
                  <span className="font-semibold text-sm text-slate-850 dark:text-dark-100">
                    {user?.roles?.join(', ')}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
