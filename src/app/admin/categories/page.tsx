'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getCategories,
  deleteCategory,
  Category,
} from '@/supabase/services/categories';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter((cat) => cat.id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || category.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'closed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className='flex-1 p-6 lg:p-10'>
      <div className='mx-auto max-w-7xl'>
        {/* PageHeading */}
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
              Award Categories
            </h1>
            <p className='text-gray-500 dark:text-gray-400'>
              Manage, create, and publish award categories for the entire
              organization.
            </p>
          </div>
          <Link
            href='/admin/categories/create'
            className='flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 md:w-auto'>
            <span className='material-symbols-outlined'>add_circle</span>
            <span className='truncate'>Create New Category</span>
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className='mt-8 flex flex-col gap-4 md:flex-row md:items-center'>
          {/* SearchBar */}
          <div className='flex-1'>
            <label className='flex flex-col min-w-40 h-12 w-full'>
              <div className='flex w-full flex-1 items-stretch rounded-lg h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <div className='text-gray-400 flex items-center justify-center pl-4'>
                  <span className='material-symbols-outlined'>search</span>
                </div>
                <input
                  className='appearance-none flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none border-none bg-transparent h-full placeholder:text-gray-400 px-2 text-base font-normal leading-normal'
                  placeholder='Search by category name...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </label>
          </div>

          {/* Chips */}
          <div className='flex gap-2 overflow-x-auto pb-2'>
            {['all', 'draft', 'published', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium transition-colors border ${
                  statusFilter === status
                    ? 'bg-primary/20 text-primary border-transparent'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
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
                ) : filteredCategories.length === 0 ? (
                  <div className='p-8 text-center text-gray-500 dark:text-gray-400'>
                    No categories found.
                  </div>
                ) : (
                  <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                    <thead className='bg-gray-50 dark:bg-gray-900/50'>
                      <tr>
                        <th
                          scope='col'
                          className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6'>
                          Category Name
                        </th>
                        <th
                          scope='col'
                          className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                          Status
                        </th>
                        <th
                          scope='col'
                          className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                          Deadline
                        </th>
                        <th
                          scope='col'
                          className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
                          <span className='sr-only'>Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800'>
                      {filteredCategories.map((category) => (
                        <tr key={category.id}>
                          <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6'>
                            {category.title}
                          </td>
                          <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${getStatusColor(
                                category.status
                              )}`}>
                              {category.status.toUpperCase()}
                            </span>
                          </td>
                          <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300'>
                            {new Date(
                              category.nomination_deadline
                            ).toLocaleDateString()}
                          </td>
                          <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className='text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors'>
                              <span className='material-symbols-outlined'>
                                delete
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
