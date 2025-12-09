'use client';

import { useEffect, useState } from 'react';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmationModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-sm overflow-hidden rounded-2xl bg-white dark:bg-card-dark shadow-2xl transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
        <div className='p-6 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20'>
            <span className='material-symbols-outlined text-3xl text-red-600 dark:text-red-400'>
              logout
            </span>
          </div>
          <h3 className='mb-2 text-xl font-bold text-text-light-primary dark:text-text-dark-primary'>
            Confirm Logout
          </h3>
          <p className='text-text-light-secondary dark:text-text-dark-secondary'>
            Are you sure you want to log out of the admin panel?
          </p>
        </div>

        <div className='grid grid-cols-2 gap-px bg-gray-100 dark:bg-gray-700'>
          <button
            onClick={onClose}
            className='block w-full bg-white dark:bg-card-dark p-4 text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='block w-full bg-white dark:bg-card-dark p-4 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
