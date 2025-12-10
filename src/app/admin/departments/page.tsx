'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getDepartments,
  deleteDepartment,
  Department,
} from '@/supabase/services/departments';
import { useToast } from '@/context/ToastContext';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error loading departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDepartment(deleteId);
      setDepartments(departments.filter((d) => d.id !== deleteId));
      toast.success('Department deleted successfully');
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department. It may be in use.');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <main className='flex-1 p-6 lg:p-10 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </main>
    );
  }

  return (
    <main className='flex-1 p-6 lg:p-10'>
      <div className='mx-auto max-w-6xl'>
        {/* Header */}
        <div className='flex flex-wrap items-center justify-between gap-4 mb-8'>
          <div>
            <h1 className='text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter'>
              Departments
            </h1>
            <p className='mt-1 text-gray-500 dark:text-gray-400'>
              Manage the list of departments available for staff and awards.
            </p>
          </div>
          <Link
            href='/admin/departments/create'
            className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors shadow-sm'>
            <span className='material-symbols-outlined text-xl'>add</span>
            Add New Department
          </Link>
        </div>

        {/* List */}
        <div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden'>
          {departments.length === 0 ? (
            <div className='p-12 text-center'>
              <div className='inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4'>
                <span className='material-symbols-outlined text-3xl text-gray-400'>
                  domain_disabled
                </span>
              </div>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                No departments found
              </h3>
              <p className='mt-1 text-gray-500 dark:text-gray-400 max-w-sm mx-auto'>
                Get started by creating your first department. This will allow
                you to assign staff members correctly.
              </p>
              <Link
                href='/admin/departments/create'
                className='mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors'>
                Create Department
              </Link>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead className='bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800'>
                  <tr>
                    <th className='px-6 py-4 font-semibold text-gray-900 dark:text-white'>
                      Name
                    </th>
                    <th className='px-6 py-4 font-semibold text-gray-900 dark:text-white'>
                      Description
                    </th>
                    <th className='px-6 py-4 text-right font-semibold text-gray-900 dark:text-white'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-800'>
                  {departments.map((dept) => (
                    <tr
                      key={dept.id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors'>
                      <td className='px-6 py-4 font-medium text-gray-900 dark:text-white'>
                        {dept.name}
                      </td>
                      <td className='px-6 py-4 text-gray-500 dark:text-gray-400'>
                        {dept.description || '-'}
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <button
                          onClick={() => handleDeleteClick(dept.id)}
                          className='inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors'
                          title='Delete Department'>
                          <span className='material-symbols-outlined text-xl'>
                            delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        title='Delete Department'
        message='Are you sure you want to delete this department? This action cannot be undone.'
        confirmText='Delete'
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </main>
  );
}
