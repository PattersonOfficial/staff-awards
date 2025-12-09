'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const description = searchParams.get('description');

  return (
    <div className='w-full max-w-md space-y-6 rounded-xl bg-card-light dark:bg-card-dark p-8 shadow-lg border border-border-light dark:border-border-dark text-center'>
      <div className='text-red-500 dark:text-red-400 text-6xl mb-4'>⚠️</div>
      <h1 className='text-2xl font-bold text-text-light-primary dark:text-text-dark-primary'>
        Authentication Error
      </h1>
      <p className='text-text-light-secondary dark:text-text-dark-secondary'>
        There was a problem signing you in. This could happen if:
      </p>
      <ul className='text-left text-sm text-text-light-secondary dark:text-text-dark-secondary space-y-2 pl-4'>
        <li>• The login link has expired</li>
        <li>• You are not using a @devopsafricalimited.com email</li>
        <li>• There was a network issue during authentication</li>
      </ul>
      {(error || description) && (
        <div className='text-left p-3 bg-red-50 dark:bg-red-900/20 rounded-lg'>
          <p className='text-xs font-medium text-red-600 dark:text-red-400'>
            Error details:
          </p>
          {error && (
            <p className='text-xs text-red-500 dark:text-red-400 mt-1'>
              Code: {error}
            </p>
          )}
          {description && (
            <p className='text-xs text-red-500 dark:text-red-400 mt-1'>
              {description}
            </p>
          )}
        </div>
      )}
      <Link
        href='/login'
        className='inline-block w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>
        Try Again
      </Link>
    </div>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4'>
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
