import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import { Lock, ShieldAlert } from 'lucide-react';

export const Settings = () => {
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordVal = watch('newPassword');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      // Context will clear token and user. Redirect to login.
      navigate('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-dark-50">Account Settings</h1>
        <p className="text-sm text-slate-400 dark:text-dark-500">Update your security settings and change passwords.</p>
      </div>

      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800/60 p-6 rounded-2xl shadow-sm space-y-6">
        <h3 className="font-extrabold text-slate-850 dark:text-dark-100 text-lg border-b border-slate-100 dark:border-dark-800 pb-3 flex items-center space-x-2">
          <Lock size={18} className="text-primary-650" />
          <span>Change Password</span>
        </h3>

        {/* Action Warning */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 p-4 rounded-xl flex items-start space-x-3 text-xs text-amber-800 dark:text-amber-300">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Warning: Security policy alert</span>
            Changing your password will immediately invalidate all active sessions across all devices (including this one). You will be required to log in again.
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.oldPassword?.message}
            {...register('oldPassword', {
              required: 'Current password is required',
            })}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'New password is required',
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: 'Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 digit, and 1 special char',
              },
            })}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: (val) => val === newPasswordVal || 'New passwords do not match',
            })}
          />

          <div className="pt-2">
            <Button type="submit" isLoading={loading}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
