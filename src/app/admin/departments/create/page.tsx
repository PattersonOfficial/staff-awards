'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createDepartment } from '@/supabase/services/departments';
import { useToast } from '@/context/ToastContext';

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createDepartment({
        name: formData.name,
        description: formData.description || null,
      });

      toast.success('Department created successfully');
      router.push('/admin/departments');
    } catch (error) {
      console.error('Error creating department:', error);
      toast.error('Failed to create department. Full name must be unique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='flex-1 p-6 lg:p-10'>
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
            href='/admin/departments'>
            Departments
          </Link>
          <span className='material-symbols-outlined text-sm text-gray-400'>
            chevron_right
          </span>
          <span className='text-gray-800 dark:text-white text-sm font-medium leading-normal'>
            Add New Department
          </span>
        </div>

        {/* Page Heading */}
        <div className='flex flex-wrap justify-between gap-3 mb-8'>
          <h1 className='text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] min-w-72'>
            Add New Department
          </h1>
        </div>

        {/* Form Container */}
        <div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8'>
          <form className='space-y-8' onSubmit={handleSubmit}>
            <div>
              <h3 className='text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-gray-200 dark:border-gray-800'>
                Department Details
              </h3>
              <div className='grid grid-cols-1 gap-6 mt-6'>
                {/* Name */}
                <label className='flex flex-col'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    Department Name
                  </p>
                  <input
                    required
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal'
                    placeholder='e.g., Engineering'
                  />
                </label>

                {/* Description */}
                <label className='flex flex-col'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    Description (Optional)
                  </p>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    className='appearance-none block w-full min-w-0 resize-y overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-28 placeholder:text-gray-400 p-4 text-base font-normal leading-normal'
                    placeholder='Describe the department...'></textarea>
                </label>
              </div>
            </div>

            {/* Action Bar */}
            <div className='flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-800'>
              <Link
                href='/admin/departments'
                className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-transparent text-gray-700 dark:text-gray-300 text-sm font-bold leading-normal tracking-[0.015em] border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'>
                <span className='truncate'>Cancel</span>
              </Link>
              <button
                disabled={loading}
                className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-sm hover:bg-primary/90 disabled:opacity-50'
                type='submit'>
                <span className='truncate'>
                  {loading ? 'Creating...' : 'Create Department'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
