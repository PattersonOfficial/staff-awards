'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { getStaff } from '@/supabase/services/staff'; // Ideally getStaffById, but getStaff checks all. I'll filter or add getStaffById logic

// Helper since getStaff returns all. In real app, we should add getStaffById to service.
// For now, I'll allow fetching all and finding one, or just querying directly here for speed.
async function fetchStaffById(id: string) {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export default function EditStaffPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState('Employee');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Image Upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function loadStaff() {
      try {
        const id = params.id as string;
        const staff = await fetchStaffById(id);
        if (staff) {
          setName(staff.name);
          setEmail(staff.email);
          setDepartment(staff.department);
          setPosition(staff.position);
          setRole(staff.role || 'Employee');
          setAvatarUrl(staff.avatar || '');
        } else {
          alert('Staff not found');
          router.push('/admin/staff');
        }
      } catch (error) {
        console.error('Error loading staff:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStaff();
  }, [params.id, router]);

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
        .from('staff-avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('staff-avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image!');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('staff')
        .update({
          name,
          email,
          department,
          position,
          role,
          avatar: avatarUrl,
        })
        .eq('id', params.id);

      if (error) throw error;

      router.push('/admin/staff');
      router.refresh(); // Refresh server components
    } catch (error) {
      console.error('Error updating staff:', error);
      alert('Error updating staff!');
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
                href='/admin/staff'
                className='text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'>
                <span className='material-symbols-outlined text-sm'>
                  arrow_back
                </span>
              </Link>
              <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
                Edit Staff
              </h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
          <div className='flex items-center gap-6'>
            <div className='shrink-0'>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt='Preview'
                  className='h-20 w-20 object-cover rounded-full border border-gray-200'
                />
              ) : (
                <div className='h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center'>
                  <span className='material-symbols-outlined text-gray-400 text-3xl'>
                    person
                  </span>
                </div>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Profile Photo
              </label>
              <input
                type='file'
                ref={fileInputRef}
                accept='image/*'
                onChange={handleImageUpload}
                className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20'
              />
              {uploadingImage && (
                <p className='text-xs text-blue-500 mt-1'>Uploading...</p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Full Name
              </label>
              <input
                type='text'
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Email
              </label>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className='mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'>
                <option value='Engineering'>Engineering</option>
                <option value='Product'>Product</option>
                <option value='Sales'>Sales</option>
                <option value='Marketing'>Marketing</option>
                <option value='HR'>HR</option>
                <option value='Design'>Design</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Position
              </label>
              <input
                type='text'
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className='mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Access Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className='mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'>
                <option value='Employee'>Employee (Voter)</option>
                <option value='Manager'>Manager</option>
                <option value='Admin'>Admin</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700'>
            <Link
              href='/admin/staff'
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
