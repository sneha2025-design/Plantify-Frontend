import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import { Mail } from 'lucide-react';

export const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await forgotPassword({ email: data.email });
      // Redirect to OTP verify with type set to FORGOT_PASSWORD
      navigate(`/verify-otp?email=${encodeURIComponent(data.email)}&type=FORGOT_PASSWORD`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-dark-50">Forgot Password?</h2>
        <p className="text-sm text-slate-400 dark:text-dark-500 font-normal">
          Enter your registered email and we'll send you a 6-digit OTP verification code to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />

        <Button type="submit" isLoading={loading} className="w-full mt-2">
          Send Recovery Code
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

export default ForgotPassword;
