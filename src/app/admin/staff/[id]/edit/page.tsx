import { use, useEffect, useState } from 'react';
import AdminHeader from '@/components/layout/AdminHeader';
import Link from 'next/link';
import {
  getStaffById,
  updateStaff,
  StaffMember,
} from '@/supabase/services/staff';
import { getDepartments, Department } from '@/supabase/services/departments';
import { useToast } from '@/context/ToastContext';
import { notFound, useRouter } from 'next/navigation';

export default function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [staffData, departmentsData] = await Promise.all([
          getStaffById(id),
          getDepartments(),
        ]);

        if (staffData) {
          setStaff(staffData);
        } else {
          // If null returned
        }
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, toast]);

  if (loading) {
    return (
      <div className='p-8 text-center text-gray-500'>
        Loading staff details...
      </div>
    );
  }

  if (!staff) {
    notFound();
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    try {
      await updateStaff(id, {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        position: formData.get('position') as string,
        department: formData.get('department') as string,
      });
      toast.success('Staff updated successfully');
      router.push('/admin/staff');
    } catch (error) {
      console.error('Error updating staff:', error);
      toast.error('Failed to update staff member.');
    } finally {
      setSaving(false);
    }
  };

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
              Edit Staff
            </span>
          </div>

          {/* Page Heading */}
          <div className='flex flex-wrap justify-between gap-3 mb-8'>
            <h1 className='text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] min-w-72'>
              Edit Staff Member
            </h1>
          </div>

          {/* Form Container */}
          <div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8'>
            <form className='space-y-8' onSubmit={handleSave}>
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
                      name='name'
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal'
                      placeholder='e.g., Jane Doe'
                      type='text'
                      defaultValue={staff.name}
                      required
                    />
                  </label>

                  {/* Email */}
                  <label className='flex flex-col'>
                    <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                      Email Address
                    </p>
                    <input
                      name='email'
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal'
                      placeholder='e.g., jane.doe@example.com'
                      type='email'
                      defaultValue={staff.email}
                      required
                    />
                  </label>
                </div>

                {/* Avatar Upload */}
                <div className='mt-6'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    Profile Photo
                  </p>
                  <div className='mt-2 flex items-center gap-6'>
                    <img
                      src={
                        staff.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          staff.name
                        )}&background=random`
                      }
                      alt={staff.name}
                      className='h-20 w-20 rounded-full object-cover border border-gray-200 dark:border-gray-700'
                    />
                    <div className='flex-1 flex justify-center rounded-lg border border-dashed border-gray-400 dark:border-gray-600 px-6 py-8'>
                      <div className='text-center'>
                        <span className='material-symbols-outlined text-3xl text-gray-400 dark:text-gray-500'>
                          account_circle
                        </span>
                        <div className='mt-2 flex text-sm leading-6 text-gray-600 dark:text-gray-300 justify-center'>
                          <label className='relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 dark:focus-within:ring-offset-background-dark hover:text-primary/80'>
                            <span>Change photo</span>
                            <input
                              className='sr-only'
                              name='file-upload'
                              type='file'
                            />
                          </label>
                        </div>
                      </div>
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
                      name='position'
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal'
                      placeholder='e.g., Senior Designer'
                      type='text'
                      defaultValue={staff?.position ?? ''}
                    />
                  </label>

                  {/* Department */}
                  <label className='flex flex-col'>
                    <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                      Department
                    </p>
                    <div className='relative'>
                      <select
                        name='department'
                        className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 px-4 pr-10 text-base font-normal leading-normal'
                        defaultValue={staff?.department ?? ''}>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.name}>
                            {dept.name}
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
                  className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'
                  type='submit'
                  disabled={saving}>
                  <span className='truncate'>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
