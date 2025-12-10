'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { getCategoryById } from '@/supabase/services/categories';
import { useToast } from '@/context/ToastContext';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { toast } = useToast();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Individual Award');
  const [department, setDepartment] = useState('All Departments');
  const [nominationDeadline, setNominationDeadline] = useState('');
  const [shortlistingStart, setShortlistingStart] = useState('');
  const [shortlistingEnd, setShortlistingEnd] = useState('');
  const [votingStart, setVotingStart] = useState('');
  const [votingEnd, setVotingEnd] = useState('');
  const [status, setStatus] = useState('draft');
  const [imageUrl, setImageUrl] = useState('');

  // Image Upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function loadCategory() {
      try {
        const id = params.id as string;
        const category = await getCategoryById(id);
        if (category) {
          setTitle(category.title);
          setDescription(category.description || '');
          setType(category.type);
          setDepartment(category.department || 'All Departments');

          // Format dates for input[type="date"]
          setNominationDeadline(
            category.nomination_deadline
              ? new Date(category.nomination_deadline)
                  .toISOString()
                  .split('T')[0]
              : ''
          );
          setShortlistingStart(
            category.shortlisting_start
              ? new Date(category.shortlisting_start)
                  .toISOString()
                  .split('T')[0]
              : ''
          );
          setShortlistingEnd(
            category.shortlisting_end
              ? new Date(category.shortlisting_end).toISOString().split('T')[0]
              : ''
          );
          setVotingStart(
            category.voting_start
              ? new Date(category.voting_start).toISOString().split('T')[0]
              : ''
          );
          setVotingEnd(
            category.voting_end
              ? new Date(category.voting_end).toISOString().split('T')[0]
              : ''
          );

          setStatus(category.status);
          setImageUrl(category.image || '');
        } else {
          toast.error('Category not found');
          router.push('/admin/categories');
        }
      } catch (error) {
        console.error('Error loading category:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCategory();
  }, [params.id, router, toast]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploadingImage(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from('category-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('category-images')
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image!');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await (supabase.from('categories') as any)
        .update({
          title,
          description,
          type,
          department,
          nomination_deadline: nominationDeadline || null,
          shortlisting_start: shortlistingStart || null,
          shortlisting_end: shortlistingEnd || null,
          voting_start: votingStart || null,
          voting_end: votingEnd || null,
          status,
          image: imageUrl,
        })
        .eq('id', params.id as string);

      if (error) throw error;

      toast.success('Category updated successfully');
      router.push('/admin/categories');
      router.refresh();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Error updating category!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
      </div>
    );
  }

  return (
    <main className='flex-1 p-6 lg:p-10'>
      <div className='mx-auto max-w-2xl'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <Link
                href='/admin/categories'
                className='text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'>
                <span className='material-symbols-outlined text-sm'>
                  arrow_back
                </span>
              </Link>
              <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
                Edit Category
              </h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
          {/* Title */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Category TItle
            </label>
            <input
              type='text'
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'
            />
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            {/* Type */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className='mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'>
                <option value='Individual Award'>Individual Award</option>
                <option value='Team Award'>Team Award</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Department Limit
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className='mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'>
                <option value='All Departments'>All Departments</option>
                <option value='Engineering'>Engineering</option>
                <option value='Product'>Product</option>
                <option value='Sales'>Sales</option>
                <option value='Marketing'>Marketing</option>
                <option value='HR'>HR</option>
              </select>
            </div>
          </div>

          {/* Status & Timeline */}
          <div className='pt-4 border-t border-gray-100 dark:border-gray-700 space-y-6'>
            <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
              Status & Timeline
            </h3>

            {/* Status */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Current Status
              </label>
              <div className='relative mt-1'>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className='appearance-none block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm pr-10'>
                  <option value='draft'>Draft (Hidden from users)</option>
                  <option value='published'>
                    Published (Visible to users)
                  </option>
                  <option value='closed'>Closed (Archived)</option>
                </select>
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500'>
                  <span className='material-symbols-outlined text-sm'>
                    expand_more
                  </span>
                </div>
              </div>
              <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                Control the visibility of this category.
              </p>
            </div>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <div>
                <label className='block text-xs font-medium text-gray-500 uppercase mb-1'>
                  Nomination Deadline
                </label>
                <input
                  type='date'
                  value={nominationDeadline}
                  onChange={(e) => setNominationDeadline(e.target.value)}
                  className='block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'
                />
              </div>

              {/* Voting Period */}
              <div>
                <label className='block text-xs font-medium text-gray-500 uppercase mb-1'>
                  Voting Start
                </label>
                <input
                  type='date'
                  value={votingStart}
                  onChange={(e) => setVotingStart(e.target.value)}
                  className='block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'
                />
              </div>
              <div>
                <label className='block text-xs font-medium text-gray-500 uppercase mb-1'>
                  Voting End
                </label>
                <input
                  type='date'
                  value={votingEnd}
                  onChange={(e) => setVotingEnd(e.target.value)}
                  className='block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Category Image
            </label>
            <div className='mt-2 flex items-center gap-4'>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt='Preview'
                  className='h-16 w-16 object-cover rounded-lg border border-gray-200'
                />
              )}
              <input
                type='file'
                ref={fileInputRef}
                accept='image/*'
                onChange={handleImageUpload}
                className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20'
              />
            </div>
            {uploadingImage && (
              <p className='text-xs text-blue-500 mt-1'>Uploading...</p>
            )}
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700'>
            <Link
              href='/admin/categories'
              className='rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'>
              Cancel
            </Link>
            <button
              type='submit'
              disabled={saving}
              className='rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50'>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
