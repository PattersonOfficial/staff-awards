'use client';

import React from 'react';
import { useAuth } from '@/supabase/hooks/useAuth';

interface AdminHeaderProps {
  title?: string;
}

export default function AdminHeader({ title = 'Dashboard' }: AdminHeaderProps) {
  const { user } = useAuth();
  const avatarUrl = user?.staff?.avatar;
  const userName = user?.staff?.name || user?.email || 'User';

  return (
    <header className='flex h-16 shrink-0 items-center justify-between border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-8'>
      <h2 className='text-lg font-bold text-text-light-primary dark:text-text-dark-primary'>
        {title}
      </h2>
      <div className='flex items-center gap-4'>
        <button className='relative rounded-full p-2 text-text-light-secondary dark:text-text-dark-secondary hover:bg-accent-light dark:hover:bg-accent-dark hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors cursor-pointer'>
          <span className='material-symbols-outlined'>notifications</span>
          <span className='absolute right-2 top-2 block h-2 w-2 rounded-full bg-red-500'></span>
        </button>
        {avatarUrl ? (
          <div
            className='bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-border-light dark:border-border-dark'
            role='img'
            aria-label={`${userName}'s avatar`}
            title={userName}
            style={{
              backgroundImage: `url("${avatarUrl}")`,
            }}></div>
        ) : (
          <div 
            className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-medium text-sm'
            title={userName}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
