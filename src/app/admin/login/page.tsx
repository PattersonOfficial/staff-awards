'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInAdmin } from '@/supabase/services/adminAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const success = await signInAdmin(email, password);
      if (success) {
        router.push('/admin');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4'>
      <div className='w-full max-w-md space-y-8 rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg border border-gray-200 dark:border-gray-700'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Admin Login
          </h1>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>
            Sign in to manage the Staff Awards
          </p>
        </div>

        {error && (
          <div className='rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400'>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className='mt-8 space-y-6'>
          <div className='space-y-4'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Email Address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm'
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-[#0A4D68]'>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
