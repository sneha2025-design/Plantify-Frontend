import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import { User, Mail, Phone, Lock, CheckSquare } from 'lucide-react';

export const Register = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup({
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
        acceptTerms: data.acceptTerms,
      });
      // Redirect to OTP verification page
      navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-dark-50">Create an Account</h2>
        <p className="text-sm text-slate-400 dark:text-dark-500">Enter your credentials to join Plantify.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username"
          placeholder="johndoe"
          icon={User}
          error={errors.username?.message}
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'Username must be at least 3 characters' },
            maxLength: { value: 50, message: 'Username must not exceed 50 characters' },
          })}
        />

        <Input
          label="Full Name"
          placeholder="John Doe"
          icon={User}
          error={errors.fullName?.message}
          {...register('fullName', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Full name must be at least 2 characters' },
          })}
        />

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
          label="Phone Number"
          placeholder="+1234567890"
          icon={Phone}
          error={errors.phoneNumber?.message}
          {...register('phoneNumber', {
            required: 'Phone number is required',
            pattern: {
              value: /^\+?[1-9]\d{1,14}$/,
              message: 'Please provide a valid E.164 phone number (e.g. +1234567890)',
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: 'Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 digit, and 1 special char',
            },
          })}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Confirm password is required',
            validate: (val) => val === passwordVal || 'Passwords do not match',
          })}
        />

        {/* Accept Terms */}
        <div className="flex items-start space-x-2.5 text-left py-1">
          <input
            type="checkbox"
            id="acceptTerms"
            className="mt-1 h-4 w-4 rounded border-slate-350 text-primary-600 focus:ring-primary-500/20"
            {...register('acceptTerms', {
              required: 'You must accept the terms and conditions to proceed',
            })}
          />
          <div className="text-sm">
            <label htmlFor="acceptTerms" className="font-semibold text-slate-700 dark:text-dark-350 cursor-pointer">
              I accept the Terms &amp; Conditions
            </label>
            {errors.acceptTerms && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.acceptTerms.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" isLoading={loading} className="w-full mt-2">
          Create Account
        </Button>
      </form>

      <div className="text-sm text-slate-500 dark:text-dark-500 text-center">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
