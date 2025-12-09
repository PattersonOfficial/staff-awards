'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockStaff } from '@/data/mockData';
import AdminHeader from '@/components/layout/AdminHeader';

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // Get unique departments for filter
  const departments = Array.from(
    new Set(mockStaff.map((s) => s.department))
  ).sort();

  const filteredStaff = mockStaff.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = selectedDepartment
      ? staff.department === selectedDepartment
      : true;

    return matchesSearch && matchesDepartment;
  });

  return (
    <main className='flex flex-1 flex-col overflow-y-auto bg-background-light dark:bg-background-dark'>
      <div className='flex-1 p-8'>
        {/* Page Header */}
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-text-light-primary dark:text-text-dark-primary'>
              Staff Directory
            </h1>
            <p className='mt-1 text-text-light-secondary dark:text-text-dark-secondary'>
              Manage your organization's staff members and their roles.
            </p>
          </div>
          <Link
            href='/admin/staff/create'
            className='flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors'>
            <span className='material-symbols-outlined text-lg'>
              person_add
            </span>
            <span>Add New Staff</span>
          </Link>
        </div>

        {/* Filters & Content */}
        <div className='rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark shadow-sm'>
          {/* Toolbar */}
          <div className='border-b border-border-light dark:border-border-dark p-4'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center'>
              {/* Search */}
              <div className='relative flex-1 max-w-md'>
                <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary'>
                  search
                </span>
                <input
                  type='text'
                  placeholder='Search staff by name, email, or role...'
                  className='w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark py-2 pl-10 pr-4 text-sm text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter */}
              <div className='relative'>
                <select
                  className='appearance-none flex h-10 items-center justify-center gap-x-2 rounded-lg bg-background-light dark:bg-background-dark px-4 pr-10 border border-border-light dark:border-border-dark text-text-light-primary dark:text-text-dark-primary text-sm font-medium focus:ring-primary/50 focus:border-primary focus:outline-none'
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}>
                  <option value=''>All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary text-xl pointer-events-none'>
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm text-text-light-secondary dark:text-text-dark-secondary'>
              <thead className='border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-text-light-primary dark:text-text-dark-primary'>
                <tr>
                  <th scope='col' className='px-6 py-3 font-medium'>
                    Name
                  </th>
                  <th scope='col' className='px-6 py-3 font-medium'>
                    Position
                  </th>
                  <th scope='col' className='px-6 py-3 font-medium'>
                    Department
                  </th>
                  <th scope='col' className='px-6 py-3 font-medium'>
                    Email
                  </th>
                  <th scope='col' className='px-6 py-3 text-right font-medium'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border-light dark:divide-border-dark'>
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <tr
                      key={staff.id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors'>
                      <td className='whitespace-nowrap px-6 py-4 font-medium text-text-light-primary dark:text-text-dark-primary'>
                        <div className='flex items-center gap-3'>
                          <img
                            className='h-9 w-9 rounded-full object-cover border border-border-light dark:border-border-dark'
                            src={staff.avatar}
                            alt={`${staff.name}'s avatar`}
                          />
                          <span>{staff.name}</span>
                        </div>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4'>
                        {staff.position}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4'>
                        <span className='inline-flex rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 px-2.5 py-0.5 text-xs font-medium'>
                          {staff.department}
                        </span>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4'>
                        {staff.email}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Link
                            href={`/admin/staff/${staff.id}/edit`}
                            className='rounded-lg p-1.5 text-text-light-secondary hover:bg-gray-100 hover:text-primary dark:text-text-dark-secondary dark:hover:bg-gray-800 transition-colors'
                            title='Edit'>
                            <span className='material-symbols-outlined text-lg'>
                              edit
                            </span>
                          </Link>
                          <button
                            className='rounded-lg p-1.5 text-text-light-secondary hover:bg-red-50 hover:text-red-600 dark:text-text-dark-secondary dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors cursor-pointer'
                            title='Delete'
                            onClick={() =>
                              confirm(
                                'Are you sure you want to delete this staff member?'
                              )
                            }>
                            <span className='material-symbols-outlined text-lg'>
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className='px-6 py-8 text-center'>
                      <div className='flex flex-col items-center justify-center gap-2'>
                        <span className='material-symbols-outlined text-4xl text-gray-300'>
                          search_off
                        </span>
                        <p className='text-base font-medium text-text-light-primary dark:text-text-dark-primary'>
                          No staff members found
                        </p>
                        <p className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
