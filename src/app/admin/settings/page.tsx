'use client';

import { useState } from 'react';
import Toast from '@/components/ui/Toast';

type Tab = 'general' | 'security';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Password Change State
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setShowPasswordForm(false); // Reset password form on save
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <main className='flex flex-1 flex-col overflow-y-auto bg-background-light dark:bg-background-dark'>
      {/* Toast Notification */}
      {showToast && (
        <Toast
          message='Settings saved successfully!'
          type='success'
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Header */}
      <div className='border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-8 py-4'>
        <h1 className='text-2xl font-bold text-text-light-primary dark:text-text-dark-primary'>
          Settings
        </h1>
      </div>

      <div className='flex-1 p-8'>
        <div className='mx-auto max-w-4xl'>
          {/* Tabs */}
          <div className='mb-6 flex space-x-1 rounded-xl bg-card-light dark:bg-card-dark p-1 border border-border-light dark:border-border-dark shadow-sm w-fit'>
            {(['general', 'security'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                <span className='material-symbols-outlined text-lg'>
                  {tab === 'general' && 'tune'}
                  {tab === 'security' && 'lock'}
                </span>
                <span className='capitalize'>{tab}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className='rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 shadow-sm'>
            {activeTab === 'general' && (
              <div className='space-y-6'>
                <div>
                  <h2 className='text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-4'>
                    Profile Settings
                  </h2>
                  <div className='grid gap-6 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary'>
                        Full Name
                      </label>
                      <input
                        type='text'
                        defaultValue='Admin User'
                        className='w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary'>
                        Email Address
                      </label>
                      <input
                        type='email'
                        defaultValue='admin@company.com'
                        className='w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                      />
                    </div>
                  </div>
                </div>

                <div className='pt-6 border-t border-border-light dark:border-border-dark'>
                  <h2 className='text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-4'>
                    Appearance
                  </h2>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium text-text-light-primary dark:text-text-dark-primary'>
                        Interface Theme
                      </p>
                      <p className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                        Select your preferred color scheme
                      </p>
                    </div>
                    <div className='flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1'>
                      <button className='px-3 py-1.5 rounded-md bg-white dark:bg-gray-700 shadow-sm text-xs font-semibold'>
                        Light
                      </button>
                      <button className='px-3 py-1.5 rounded-md text-text-light-secondary dark:text-text-dark-secondary text-xs font-medium hover:text-primary'>
                        Dark
                      </button>
                      <button className='px-3 py-1.5 rounded-md text-text-light-secondary dark:text-text-dark-secondary text-xs font-medium hover:text-primary'>
                        System
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className='space-y-6'>
                <div>
                  <h2 className='text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-4'>
                    Password
                  </h2>

                  {!showPasswordForm ? (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className='flex items-center gap-2 rounded-lg border border-border-light dark:border-border-dark px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                      <span className='material-symbols-outlined text-lg'>
                        key
                      </span>
                      Change Password
                    </button>
                  ) : (
                    <div className='bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-4 max-w-md border border-border-light dark:border-border-dark'>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary'>
                          Current Password
                        </label>
                        <input
                          type='password'
                          className='w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                          placeholder='Enter current password'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary'>
                          New Password
                        </label>
                        <input
                          type='password'
                          className='w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                          placeholder='Enter new password'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary'>
                          Confirm New Password
                        </label>
                        <input
                          type='password'
                          className='w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                          placeholder='Confirm new password'
                        />
                      </div>
                      <div className='flex gap-2 pt-2'>
                        <button
                          onClick={() => setShowPasswordForm(false)}
                          className='px-3 py-1.5 text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors'>
                          Cancel
                        </button>
                        {/* We rely on the main Save Changes button for the actual action in this demo, 
                                    but visually this form is part of the "settings state" */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className='mt-8 flex justify-end pt-6 border-t border-border-light dark:border-border-dark'>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className='flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 disabled:opacity-70 transition-all'>
                {isSaving ? (
                  <>
                    <span className='material-symbols-outlined animate-spin text-lg'>
                      progress_activity
                    </span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className='material-symbols-outlined text-lg'>
                      save
                    </span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
