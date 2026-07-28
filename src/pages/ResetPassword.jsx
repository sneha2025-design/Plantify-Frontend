import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import { Mail, KeyRound, Lock } from 'lucide-react';

export const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const emailParam = searchParams.get('email') || '';
  const otpParam = searchParams.get('otp') || '';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: emailParam,
      otp: otpParam,
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (emailParam) setValue('email', emailParam);
    if (otpParam) setValue('otp', otpParam);
  }, [emailParam, otpParam, setValue]);

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await resetPassword({
        email: data.email,
        otp: data.otp,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      navigate('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-dark-50">Reset Password</h2>
        <p className="text-sm text-slate-400 dark:text-dark-500 font-normal">
          Enter your new password and the verification code sent to your email.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          icon={Mail}
          readOnly={!!emailParam}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
          })}
        />

        <Input
          label="Verification Code (OTP)"
          type="text"
          placeholder="123456"
          icon={KeyRound}
          readOnly={!!otpParam}
          error={errors.otp?.message}
          {...register('otp', {
            required: 'OTP is required',
            pattern: {
              value: /^\d{6}$/,
              message: 'OTP must be exactly 6 digits',
            },
          })}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.password?.message}
          {...register('password', {
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
            validate: (val) => val === passwordVal || 'Passwords do not match',
          })}
        />

        <Button type="submit" isLoading={loading} className="w-full mt-2">
          Reset Password
        </Button>
      </form>

      <div className="text-sm text-slate-500 dark:text-dark-500 text-center">
        Remember your password?{' '}
        <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
