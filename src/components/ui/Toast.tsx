'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({
  message,
  type = 'success',
  isVisible,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const colors = {
    success: 'bg-green-500 dark:bg-green-600',
    error: 'bg-red-500 dark:bg-red-600',
    info: 'bg-blue-500 dark:bg-blue-600',
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  return (
    <div className='fixed top-6 right-6 z-50 animate-in slide-in-from-top-5 fade-in'>
      <div
        className={`${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
        <span className='material-symbols-outlined text-2xl'>
          {icons[type]}
        </span>
        <p className='font-medium flex-1'>{message}</p>
        <button
          onClick={onClose}
          className='hover:bg-white/20 rounded p-1 transition-colors cursor-pointer'>
          <span className='material-symbols-outlined text-lg'>close</span>
        </button>
      </div>
    </div>
  );
}
