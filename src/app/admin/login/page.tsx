'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/supabase/hooks/useAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      router.push('/admin');
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4'>
      <div className='w-full max-w-md space-y-8 rounded-xl bg-card-light dark:bg-card-dark p-8 shadow-lg border border-border-light dark:border-border-dark'>
        <div className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white'>
            <span className='material-symbols-outlined text-2xl'>
              admin_panel_settings
            </span>
          </div>
          <h1 className='text-3xl font-bold text-text-light-primary dark:text-text-dark-primary'>
            Admin Login
          </h1>
          <p className='mt-2 text-text-light-secondary dark:text-text-dark-secondary'>
            Sign in to access the administration panel
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
                className='block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary'>
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='mt-1 block w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-text-light-primary dark:text-text-dark-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary'>
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
                className='mt-1 block w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-text-light-primary dark:text-text-dark-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900'>
            {loading ? (
              <span className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
