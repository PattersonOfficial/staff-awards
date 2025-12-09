'use client';

import { useState } from 'react';
import { useAuth } from '@/supabase/hooks/useAuth';
import Image from 'next/image';

export default function LoginPage() {
  const { signInWithOAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await signInWithOAuth('google');
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4'>
      <div className='w-full max-w-md space-y-8 rounded-xl bg-card-light dark:bg-card-dark p-8 shadow-lg border border-border-light dark:border-border-dark'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-text-light-primary dark:text-text-dark-primary'>
            Welcome Back
          </h1>
          <p className='mt-2 text-text-light-secondary dark:text-text-dark-secondary'>
            Sign in to access the Staff Awards portal
          </p>
        </div>

        {error && (
          <div className='rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400'>
            {error}
          </div>
        )}

        <div className='mt-8 space-y-4'>
          <button
            onClick={handleGoogleLogin}
            className='flex w-full items-center justify-center gap-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 px-4 py-3 text-sm font-medium text-text-light-primary dark:text-text-dark-primary transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900'>
            <svg className='h-5 w-5' viewBox='0 0 24 24'>
              <path
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                fill='#4285F4'
              />
              <path
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                fill='#34A853'
              />
              <path
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                fill='#FBBC05'
              />
              <path
                d='M12 4.63c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                fill='#EA4335'
              />
            </svg>
            Sign in with Google
          </button>
        </div>

        <div className='mt-6 text-center text-xs text-text-light-secondary dark:text-text-dark-secondary'>
          <p>
            Restricted to{' '}
            <span className='font-medium'>@devopsafricalimited.com</span>{' '}
            accounts only
          </p>
        </div>
      </div>
    </div>
  );
}
