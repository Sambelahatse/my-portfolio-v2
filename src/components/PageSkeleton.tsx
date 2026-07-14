import React from 'react';

const PageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <div className="h-16 animate-pulse bg-neutral-50 dark:bg-dark-surface" />
      <div className="max-w-5xl mx-auto px-6 pt-32 space-y-16">
        <div className="space-y-4">
          <div className="h-4 w-32 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded" />
          <div className="h-12 w-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded" />
          <div className="h-6 w-64 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded" />
        </div>
        <div className="h-64 animate-pulse bg-neutral-50 dark:bg-dark-surface rounded-2xl" />
        <div className="h-64 animate-pulse bg-neutral-50 dark:bg-dark-surface rounded-2xl" />
      </div>
    </div>
  );
};

export default PageSkeleton;
