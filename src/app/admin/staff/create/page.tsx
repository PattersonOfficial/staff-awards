'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { createStaff } from '@/supabase/services/staff';

export default function CreateStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    role: 'staff',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = null;

      if (file) {
        // Upload image to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('staff-avatars')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('staff-avatars')
          .getPublicUrl(filePath);

        avatarUrl = data.publicUrl;
      }

      await createStaff({
        name: formData.name,
        email: formData.email,
        department: formData.department,
        position: formData.position,
        role: formData.role,
        avatar: avatarUrl,
      });

      router.push('/admin/staff');
    } catch (error) {
      console.error('Error creating staff member:', error);
      alert('Failed to create staff member. Please try again.');
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
            href='/admin/staff'>
            Staff
          </Link>
          <span className='material-symbols-outlined text-sm text-gray-400'>
            chevron_right
          </span>
          <span className='text-gray-800 dark:text-white text-sm font-medium leading-normal'>
            Add New Staff
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
          <form className='space-y-8' onSubmit={handleSubmit}>
            {/* Staff Details */}
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
                    required
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal'
                    placeholder='e.g., John Doe'
                  />
                </label>

                {/* Email */}
                <label className='flex flex-col'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    Email Address
                  </p>
                  <input
                    required
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal'
                    placeholder='e.g., john.doe@company.com'
                  />
                </label>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                {/* Position */}
                <label className='flex flex-col'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    Job Title / Position
                  </p>
                  <input
                    required
                    name='position'
                    value={formData.position}
                    onChange={handleInputChange}
                    className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal'
                    placeholder='e.g., Senior Developer'
                  />
                </label>

                {/* Department */}
                <label className='flex flex-col'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    Department
                  </p>
                  <input
                    required
                    name='department'
                    value={formData.department}
                    onChange={handleInputChange}
                    className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal'
                    placeholder='e.g., Engineering'
                  />
                </label>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                {/* Role */}
                <label className='flex flex-col'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    System Role
                  </p>
                  <div className='relative'>
                    <select
                      name='role'
                      value={formData.role}
                      onChange={handleInputChange}
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 px-4 text-base font-normal leading-normal'>
                      <option value='staff'>Staff Member</option>
                      <option value='admin'>Administrator</option>
                    </select>
                    <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500'>
                      <span className='material-symbols-outlined'>
                        expand_more
                      </span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Avatar Upload */}
              <div className='mt-6'>
                <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                  Profile Picture (Avatar)
                </p>
                <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-400 dark:border-gray-600 px-6 py-10'>
                  <div className='text-center'>
                    {file ? (
                      <div className='relative'>
                        <span className='material-symbols-outlined text-4xl text-green-500'>
                          check_circle
                        </span>
                        <p className='mt-2 text-sm text-gray-600 dark:text-gray-300 font-semibold'>
                          {file.name}
                        </p>
                      </div>
                    ) : (
                      <>
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
                              accept='image/*'
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className='pl-1'>or drag and drop</p>
                        </div>
                        <p className='text-xs leading-5 text-gray-500 dark:text-gray-400'>
                          PNG, JPG up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
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
                disabled={loading}
                className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-sm hover:bg-primary/90 disabled:opacity-50'
                type='submit'>
                <span className='truncate'>
                  {loading ? 'Creating...' : 'Create Staff Member'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
