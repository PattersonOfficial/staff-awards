import React from 'react';

interface PublishWinnerModalProps {
  isOpen: boolean;
  categoryTitle: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function PublishWinnerModal({
  isOpen,
  categoryTitle,
  onConfirm,
  onClose,
}: PublishWinnerModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md'>
        <div className='p-6'>
          <div className='flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mx-auto mb-4'>
            <span className='material-symbols-outlined text-4xl text-yellow-600 dark:text-yellow-400'>
              military_tech
            </span>
          </div>

          <h3 className='text-xl font-bold text-gray-900 dark:text-white text-center mb-2'>
            Publish Winner?
          </h3>

          <p className='text-gray-600 dark:text-gray-400 text-center mb-6'>
            Are you sure you want to publish the winner for{' '}
            <span className='font-semibold text-gray-900 dark:text-white'>
              {categoryTitle}
            </span>
            ? This action will make the results visible to all users and cannot
            be undone.
          </p>

          <div className='flex gap-3'>
            <button
              onClick={onClose}
              className='flex-1 px-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors cursor-pointer'>
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className='flex-1 px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold transition-colors cursor-pointer shadow-sm shadow-primary/20'>
              Publish Winner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
