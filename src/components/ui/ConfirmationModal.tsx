// Reusable Confirmation Modal
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean; // If true, confirm button is red
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform scale-100 animate-in zoom-in-95 duration-200'>
        {/* Content */}
        <div className='p-6 text-center'>
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-6 ${
              isDangerous
                ? 'bg-red-100 text-red-600'
                : 'bg-blue-100 text-primary'
            }`}>
            <span className='material-symbols-outlined text-3xl'>
              {isDangerous ? 'warning' : 'info'}
            </span>
          </div>
          <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
            {title}
          </h3>
          <p className='text-gray-500 dark:text-gray-400 mb-8'>{message}</p>

          {/* Actions */}
          <div className='flex gap-3'>
            <button
              onClick={onClose}
              className='flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm transition-all ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-700 hover:shadow-red-500/25'
                  : 'bg-primary hover:bg-primary/90 hover:shadow-primary/25'
              }`}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
