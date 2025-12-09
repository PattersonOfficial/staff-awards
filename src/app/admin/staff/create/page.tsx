'use client';

import AdminHeader from '@/components/layout/AdminHeader';
import Link from 'next/link';

export default function CreateStaffPage() {
  const departments = [
    'Business Intelligence',
    'Customer Service',
    'Engineering',
    'Finance',
    'Human Resources',
    'IT Security',
    'Marketing',
    'Operations',
    'Product',
    'Sales',
    'Technology Department',
  ];

  return (
    <main className='flex flex-1 flex-col overflow-y-auto bg-background-light dark:bg-background-dark'>
      <div className='flex-1 p-8'>
        <div className='mx-auto max-w-4xl'>
          {/* Breadcrumbs */}
          <div className='flex flex-wrap items-center gap-2 mb-6'>
            <Link
              className='text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary'
              href='/admin'>
              Admin Dashboard
            </Link>
            <span className='material-symbols-outlined text-sm text-gray-400'>
              chevron_right
            </span>
            <Link
              className='text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary'
              href='/admin/staff'>
              Staff
            </Link>
            <span className='material-symbols-outlined text-sm text-gray-400'>
              chevron_right
            </span>
            <span className='text-gray-800 dark:text-white text-sm font-medium leading-normal'>
              Add Staff Member
            </span>
          </div>

          {/* Page Heading */}
          <div className='flex flex-wrap justify-between gap-3 mb-8'>
            <h1 className='text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] min-w-72'>
              Add New Staff Member
            </h1>
          </div>

          {/* Form Container */}
          <div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8'>
            <form className='space-y-8' onSubmit={(e) => e.preventDefault()}>
              {/* Personal Information */}
              <div>
                <h3 className='text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-gray-200 dark:border-gray-800'>
                  Personal Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                  {/* Name */}
                  <label className='flex flex-col'>
                    <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                      Full Name
                    </p>
                    <input
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal'
                      placeholder='e.g., Jane Doe'
                      type='text'
                    />
                  </label>

                  {/* Email */}
                  <label className='flex flex-col'>
                    <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                      Email Address
                    </p>
                    <input
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal'
                      placeholder='e.g., jane.doe@example.com'
                      type='email'
                    />
                  </label>
                </div>

                {/* Avatar Upload */}
                <div className='mt-6'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    Profile Photo
                  </p>
                  <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-400 dark:border-gray-600 px-6 py-10'>
                    <div className='text-center'>
                      <span className='material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500'>
                        account_circle
                      </span>
                      <div className='mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-300 justify-center'>
                        <label className='relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 dark:focus-within:ring-offset-background-dark hover:text-primary/80'>
                          <span>Upload a photo</span>
                          <input
                            className='sr-only'
                            name='file-upload'
                            type='file'
                          />
                        </label>
                        <p className='pl-1'>or drag and drop</p>
                      </div>
                      <p className='text-xs leading-5 text-gray-500 dark:text-gray-400'>
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Department */}
              <div>
                <h3 className='text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-gray-200 dark:border-gray-800'>
                  Role & Department
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                  {/* Position */}
                  <label className='flex flex-col'>
                    <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                      Position / Title
                    </p>
                    <input
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal'
                      placeholder='e.g., Senior Designer'
                      type='text'
                    />
                  </label>

                  {/* Department */}
                  <label className='flex flex-col'>
                    <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                      Department
                    </p>
                    <div className='relative'>
                      <select
                        className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 px-4 pr-10 text-base font-normal leading-normal'
                        defaultValue=''>
                        <option value='' disabled>
                          Select Department
                        </option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      <span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'>
                        expand_more
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Bar */}
              <div className='flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-800'>
                <Link
                  href='/admin/staff'
                  className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-transparent text-gray-700 dark:text-gray-300 text-sm font-bold leading-normal tracking-[0.015em] border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'>
                  <span className='truncate'>Cancel</span>
                </Link>
                <button
                  className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-sm hover:bg-primary/90'
                  type='submit'>
                  <span className='truncate'>Add Staff Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
