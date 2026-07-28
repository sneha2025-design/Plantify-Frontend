import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm focus:ring-primary-500 focus:ring-offset-white dark:focus:ring-offset-dark-950',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400 dark:bg-dark-800 dark:hover:bg-dark-700 dark:text-dark-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-dark-950',
    outline: 'border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700 focus:ring-primary-500 dark:border-dark-800 dark:text-dark-200 dark:hover:bg-dark-900',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4.5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center space-x-2">
          <LoadingSpinner size="sm" color={variant === 'primary' || variant === 'danger' ? 'white' : 'slate'} />
          <span>Please wait...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
