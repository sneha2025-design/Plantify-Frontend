import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import { Mail, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export const VerifyOtp = () => {
  const { verifyOtp, resendOtp } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const emailParam = searchParams.get('email') || '';
  const typeParam = searchParams.get('type') || 'REGISTRATION'; // 'REGISTRATION' or 'FORGOT_PASSWORD'

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: emailParam,
      otp: '',
    },
  });

  useEffect(() => {
    if (emailParam) {
      setValue('email', emailParam);
    }
  }, [emailParam, setValue]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (typeParam === 'FORGOT_PASSWORD') {
        // Redirect to reset password page directly. The OTP will be verified atomically
        // when the user submits their new password in the ResetPassword page.
        navigate(`/reset-password?email=${encodeURIComponent(data.email)}&otp=${encodeURIComponent(data.otp)}`);
      } else {
        await verifyOtp({
          email: data.email,
          otp: data.otp,
          type: typeParam,
        });
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    const emailValue = watchEmail();
    if (!emailValue) {
      toast.error('Please enter your email address first.');
      return;
    }

    setResending(true);
    try {
      await resendOtp({
        email: emailValue,
        type: typeParam,
      });
      setCountdown(60); // 60 seconds lockout
    } catch (err) {
      console.error(err);
    } finally {
      setResending(false);
    }
  };

  // Watch helper
  const watchEmail = () => {
    return document.querySelector('input[name="email"]')?.value || emailParam;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-dark-50">Email Verification</h2>
        <p className="text-sm text-slate-400 dark:text-dark-500">
          Enter the 6-digit verification code sent to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <Input
          label="One-Time Password (OTP)"
          type="text"
          placeholder="123456"
          icon={KeyRound}
          error={errors.otp?.message}
          maxLength={6}
          {...register('otp', {
            required: 'OTP code is required',
            pattern: {
              value: /^\d{6}$/,
              message: 'OTP must be exactly 6 digits',
            },
          })}
        />

        <div className="flex justify-between items-center text-xs py-1">
          <span className="text-slate-400">Did not receive the code?</span>
          <button
            onClick={handleResend}
            disabled={resending || countdown > 0}
            className="font-bold text-primary-650 hover:text-primary-750 disabled:text-slate-350 dark:disabled:text-dark-600 transition-colors"
          >
            {countdown > 0 ? `Resend Code (${countdown}s)` : 'Resend Code'}
          </button>
        </div>

        <Button type="submit" isLoading={loading} className="w-full mt-2">
          Verify Verification Code
        </Button>
      </form>

      <div className="text-sm text-slate-500 dark:text-dark-500 text-center">
        Go back to{' '}
        <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default VerifyOtp;
