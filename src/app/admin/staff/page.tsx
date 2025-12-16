'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import Avatar from '@/components/ui/Avatar';
import Pagination from '@/components/ui/Pagination';
import { getStaff, deleteStaff, StaffMember } from '@/supabase/services/staff';

const ITEMS_PER_PAGE = 10;

export default function AdminStaffPage() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    try {
      setLoading(true);
      const data = await getStaff();
      setStaffMembers(data || []);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (id: string) => {
    setStaffToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!staffToDelete) return;

    try {
      await deleteStaff(staffToDelete);
      setStaffMembers(staffMembers.filter((s) => s.id !== staffToDelete));
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Failed to delete staff member');
    } finally {
      setDeleteModalOpen(false);
      setStaffToDelete(null);
    }
  };

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (staff.department &&
        staff.department.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <main className='flex-1 p-6 lg:p-10'>
      <div className='mx-auto max-w-7xl'>
        {/* PageHeading */}
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
              Staff Management
            </h1>
            <p className='text-gray-500 dark:text-gray-400'>
              Manage employees, their roles, and departments.
            </p>
          </div>
          <Link
            href='/admin/staff/create'
            className='flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 md:w-auto'>
            <span className='material-symbols-outlined'>person_add</span>
            <span className='truncate'>Add New Staff</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className='mt-8'>
          <label className='flex flex-col min-w-40 h-12 w-full md:max-w-md'>
            <div className='flex w-full flex-1 items-stretch rounded-lg h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
              <div className='text-gray-400 flex items-center justify-center pl-4'>
                <span className='material-symbols-outlined'>search</span>
              </div>
              <input
                className='appearance-none flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none border-none bg-transparent h-full placeholder:text-gray-400 px-2 text-base font-normal leading-normal'
                placeholder='Search by name, email, or department...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </label>
        </div>

        {/* Table */}
        <div className='mt-6 flow-root'>
          <div className='overflow-x-auto'>
            <div className='inline-block min-w-full align-middle'>
              <div className='overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
                {loading ? (
                  <div className='flex p-8 justify-center'>
                    <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
                  </div>
                ) : filteredStaff.length === 0 ? (
                  <div className='p-8 text-center text-gray-500 dark:text-gray-400'>
                    No staff members found.
                  </div>
                ) : (
                  <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                    <thead className='bg-gray-50 dark:bg-gray-900/50'>
                      <tr>
                        <th
                          scope='col'
                          className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6'>
                          Name
                        </th>
                        <th
                          scope='col'
                          className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                          Title & Department
                        </th>
                        <th
                          scope='col'
                          className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                          Role
                        </th>
                        <th
                          scope='col'
                          className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
                          <span className='sr-only'>Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800'>
                      {paginatedStaff.map((staff) => (
                        <tr key={staff.id}>
                          <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6'>
                            <div className='flex items-center'>
                              <Avatar
                                src={staff.avatar}
                                name={staff.name}
                                className='h-10 w-10'
                              />
                              <div className='ml-4'>
                                <div className='font-medium text-gray-900 dark:text-white'>
                                  {staff.name}
                                </div>
                                <div className='text-gray-500 dark:text-gray-400'>
                                  {staff.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300'>
                            <div className='text-gray-900 dark:text-white'>
                              {staff.position || 'N/A'}
                            </div>
                            <div className='text-gray-500'>
                              {staff.department || 'N/A'}
                            </div>
                          </td>
                          <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                staff.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                              {staff.role}
                            </span>
                          </td>
                          <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                            <Link
                              href={`/admin/staff/${staff.id}/edit`}
                              className='p-1 text-gray-400 hover:text-primary transition-colors'
                              title='Edit'>
                              <span className='material-symbols-outlined text-lg'>
                                edit
                              </span>
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(staff.id)}
                              className='p-1 text-gray-400 hover:text-red-500 transition-colors'
                              title='Delete'>
                              <span className='material-symbols-outlined text-lg'>
                                delete
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={filteredStaff.length}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete Staff Member'
        message='Are you sure you want to remove this staff member? This action cannot be undone.'
        isDangerous={true}
        confirmText='Delete'
      />
    </main>
  );
}
