import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import { Mail, Lock } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Retrieve default redirect path if coming from ProtectedRoute redirect
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      usernameOrEmail: '',
      password: '',
      rememberMe: false,
    },
  });

  // Remember Me logic: load username/email if saved previously
  useEffect(() => {
    const savedLogin = localStorage.getItem('rememberedUser');
    if (savedLogin) {
      setValue('usernameOrEmail', savedLogin);
      setValue('rememberMe', true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login({
        usernameOrEmail: data.usernameOrEmail,
        password: data.password,
      });

      if (data.rememberMe) {
        localStorage.setItem('rememberedUser', data.usernameOrEmail);
      } else {
        localStorage.removeItem('rememberedUser');
      }

      navigate(from, { replace: true });
    } catch (err) {
      // If error message tells user they are not verified, redirect them to verification page after 2 seconds
      const message = err.response?.data?.message || '';
      if (message.toLowerCase().includes('not verified')) {
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(data.usernameOrEmail)}`);
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-dark-50">Welcome Back</h2>
        <p className="text-sm text-slate-400 dark:text-dark-500">Sign in to your Plantify account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Username or Email"
          placeholder="name@example.com or username"
          icon={Mail}
          error={errors.usernameOrEmail?.message}
          {...register('usernameOrEmail', {
            required: 'Username or email is required',
            minLength: { value: 3, message: 'Please enter a valid credential' },
          })}
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
            })}
          />
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center space-x-2.5 text-left py-0.5">
          <input
            type="checkbox"
            id="rememberMe"
            className="h-4 w-4 rounded border-slate-350 text-primary-600 focus:ring-primary-500/20"
            {...register('rememberMe')}
          />
          <label htmlFor="rememberMe" className="text-sm font-semibold text-slate-700 dark:text-dark-350 cursor-pointer select-none">
            Remember me
          </label>
        </div>

        <Button type="submit" isLoading={loading} className="w-full mt-2">
          Sign In
        </Button>
      </form>

      <div className="text-sm text-slate-500 dark:text-dark-500 text-center">
        New to Plantify?{' '}
        <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
          Create an Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
