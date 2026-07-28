import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 rounded-2xl p-6 shadow-sm space-y-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-slate-200 dark:bg-dark-800 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-dark-800 rounded w-1/3"></div>
          <div className="h-3 bg-slate-200 dark:bg-dark-800 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3 pt-4">
        <div className="h-3 bg-slate-200 dark:bg-dark-800 rounded"></div>
        <div className="h-3 bg-slate-200 dark:bg-dark-800 rounded w-5/6"></div>
        <div className="h-3 bg-slate-200 dark:bg-dark-800 rounded w-2/3"></div>
      </div>
      <div className="flex space-x-2 pt-4">
        <div className="h-10 bg-slate-200 dark:bg-dark-800 rounded w-24"></div>
        <div className="h-10 bg-slate-200 dark:bg-dark-800 rounded w-24"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
