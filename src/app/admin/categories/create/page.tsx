'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { createCategory } from '@/supabase/services/categories';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    nominationStart: '',
    nominationEnd: '',
    votingStart: '',
    votingEnd: '',
    status: 'draft',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      let imageUrl = null;

      if (file) {
        // Upload image to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('category-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('category-images')
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      await createCategory({
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        department: formData.department || null,
        type: 'Individual Award', // Default for now
        status: formData.status as 'draft' | 'published' | 'closed',
        nomination_deadline: formData.nominationEnd, // Backward compat
        shortlisting_start: null, // Not in form yet
        shortlisting_end: null, // Not in form yet
        voting_start: formData.votingStart || null,
        voting_end: formData.votingEnd || null,
      });

      router.push('/admin/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category. Please try again.');
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
            href='/admin/categories'>
            Awards
          </Link>
          <span className='material-symbols-outlined text-sm text-gray-400'>
            chevron_right
          </span>
          <span className='text-gray-800 dark:text-white text-sm font-medium leading-normal'>
            Create Category
          </span>
        </div>

        {/* Page Heading */}
        <div className='flex flex-wrap justify-between gap-3 mb-8'>
          <h1 className='text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] min-w-72'>
            Create New Award Category
          </h1>
        </div>

        {/* Form Container */}
        <div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8'>
          <form className='space-y-8' onSubmit={handleSubmit}>
            {/* Section 1: Category Details */}
            <div>
              <h3 className='text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-gray-200 dark:border-gray-800'>
                Category Details
              </h3>
              <div className='grid grid-cols-1 gap-6 mt-6'>
                {/* Category Name */}
                <label className='flex flex-col'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    Category Name
                  </p>
                  <input
                    required
                    name='title'
                    value={formData.title}
                    onChange={handleInputChange}
                    className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal'
                    placeholder='e.g., Innovator of the Year'
                  />
                </label>

                {/* Description */}
                <label className='flex flex-col'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    Description
                  </p>
                  <textarea
                    required
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    className='appearance-none block w-full min-w-0 resize-y overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-28 placeholder:text-gray-400 p-4 text-base font-normal leading-normal'
                    placeholder='Describe what this award recognizes...'></textarea>
                </label>

                {/* File Uploader */}
                <div>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    Category Icon or Image
                  </p>
                  <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-400 dark:border-gray-600 px-6 py-10'>
                    <div className='text-center'>
                      <span className='material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500'>
                        cloud_upload
                      </span>
                      <div className='mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-300 justify-center'>
                        <label className='relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 dark:focus-within:ring-offset-background-dark hover:text-primary/80'>
                          <span>{file ? file.name : 'Upload a file'}</span>
                          <input
                            className='sr-only'
                            name='file-upload'
                            type='file'
                            accept='image/*'
                            onChange={handleFileChange}
                          />
                        </label>
                        {!file && <p className='pl-1'>or drag and drop</p>}
                      </div>
                      <p className='text-xs leading-5 text-gray-500 dark:text-gray-400'>
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Status & Timeline */}
            <div>
              <h3 className='text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-gray-200 dark:border-gray-800'>
                Status & Timeline
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6'>
                {/* Status */}
                <div className='space-y-6 md:col-span-2'>
                  <label className='flex flex-col'>
                    <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                      Initial Status
                    </p>
                    <div className='relative'>
                      <select
                        name='status'
                        value={formData.status}
                        onChange={handleInputChange}
                        className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 px-4 pr-10 text-base font-normal leading-normal'>
                        <option value='draft'>Draft (Hidden from users)</option>
                        <option value='published'>
                          Published (Visible to users)
                        </option>
                        <option value='closed'>Closed (Archived)</option>
                      </select>
                      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500'>
                        <span className='material-symbols-outlined'>
                          expand_more
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Nomination Period */}
                <div className='space-y-6'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium'>
                    Nomination Period
                  </p>
                  <label className='flex flex-col'>
                    <p className='text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal pb-2'>
                      Start Date & Time
                    </p>
                    <input
                      name='nominationStart'
                      value={formData.nominationStart}
                      onChange={handleInputChange}
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 px-4 text-base font-normal leading-normal'
                      type='datetime-local'
                    />
                  </label>
                  <label className='flex flex-col'>
                    <p className='text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal pb-2'>
                      End Date & Time
                    </p>
                    <input
                      required
                      name='nominationEnd'
                      value={formData.nominationEnd}
                      onChange={handleInputChange}
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 px-4 text-base font-normal leading-normal'
                      type='datetime-local'
                    />
                  </label>
                </div>
                {/* Voting Period */}
                <div className='space-y-6'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium'>
                    Voting Period
                  </p>
                  <label className='flex flex-col'>
                    <p className='text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal pb-2'>
                      Start Date & Time
                    </p>
                    <input
                      name='votingStart'
                      value={formData.votingStart}
                      onChange={handleInputChange}
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 px-4 text-base font-normal leading-normal'
                      type='datetime-local'
                    />
                  </label>
                  <label className='flex flex-col'>
                    <p className='text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal pb-2'>
                      End Date & Time
                    </p>
                    <input
                      name='votingEnd'
                      value={formData.votingEnd}
                      onChange={handleInputChange}
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 px-4 text-base font-normal leading-normal'
                      type='datetime-local'
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className='flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-800'>
              <Link
                href='/admin/categories'
                className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-transparent text-gray-700 dark:text-gray-300 text-sm font-bold leading-normal tracking-[0.015em] border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'>
                <span className='truncate'>Cancel</span>
              </Link>
              <button
                disabled={loading}
                className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-sm hover:bg-primary/90 disabled:opacity-50'
                type='submit'>
                <span className='truncate'>
                  {loading ? 'Creating...' : 'Create Category'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
