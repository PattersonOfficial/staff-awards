'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = {
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className='fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none'>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto min-w-[300px] max-w-sm rounded-lg p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right-full ${
              t.type === 'success'
                ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
                : t.type === 'error'
                ? 'bg-red-50 text-red-800 border-l-4 border-red-500'
                : 'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
            }`}>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex items-center gap-2'>
                {t.type === 'success' && (
                  <span className='material-symbols-outlined text-green-500'>
                    check_circle
                  </span>
                )}
                {t.type === 'error' && (
                  <span className='material-symbols-outlined text-red-500'>
                    error
                  </span>
                )}
                {t.type === 'info' && (
                  <span className='material-symbols-outlined text-blue-500'>
                    info
                  </span>
                )}
                <p className='text-sm font-medium'>{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className='text-gray-400 hover:text-gray-600 focus:outline-none'>
                <span className='material-symbols-outlined text-lg'>close</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
