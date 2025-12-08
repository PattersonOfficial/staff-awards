import React from 'react';

interface AdminHeaderProps {
  title?: string;
}

export default function AdminHeader({ title = 'Dashboard' }: AdminHeaderProps) {
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
        <div
          className='bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10'
          data-alt='User avatar image'
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNbkBM34qZFMt2Bp68tCijB8JLpgi_kHd88ghG4IMvO6kjzDtnmxHmqRWvu2mcNMsLoGLrr7ROwky5EqG00fDkxDnDTQNYSWBkaqiHz7JwqxJfhXOdPw3vdZtASBFkaeu3mMkaOem7HElW7xuRrZ33-naGLbSTfRN9-Vf-TlfaQravPoEB8j8i-c1Sw2UnAa2w26rzqHgmTDVVgAiAtmCl8ql8MpkFtlN6vmNAtB6dcp3ZkFA7ggDWlAuzsejdaLjzCMYSL2RVFkSh")',
          }}></div>
      </div>
    </header>
  );
}
