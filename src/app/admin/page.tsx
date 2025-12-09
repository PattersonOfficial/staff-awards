'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/supabase/client';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    nominations: 0,
    votes: 0,
    categories: 0,
    staff: 0,
    pendingNominations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        // Execute multiple count queries in parallel
        const [
          { count: nominationsCount },
          { count: votesCount },
          { count: categoriesCount },
          { count: staffCount },
          { count: pendingCount },
        ] = await Promise.all([
          supabase
            .from('nominations')
            .select('*', { count: 'exact', head: true }),
          supabase.from('votes').select('*', { count: 'exact', head: true }),
          supabase
            .from('categories')
            .select('*', { count: 'exact', head: true }),
          supabase.from('staff').select('*', { count: 'exact', head: true }),
          supabase
            .from('nominations')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending'),
        ]);

        setStats({
          nominations: nominationsCount || 0,
          votes: votesCount || 0,
          categories: categoriesCount || 0,
          staff: staffCount || 0,
          pendingNominations: pendingCount || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <main className='flex-1 p-6 lg:p-10'>
      <div className='mx-auto max-w-7xl'>
        {/* Heading */}
        <div className='flex flex-col gap-2 mb-8'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Dashboard
          </h1>
          <p className='text-text-light-secondary dark:text-text-dark-secondary'>
            Overview of the awards platform activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Nominations Card */}
          <div className='overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'>
            <dt className='truncate text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary'>
              Total Nominations
            </dt>
            <dd className='mt-2 flex items-baseline gap-2'>
              <span className='text-3xl font-semibold tracking-tight text-gray-900 dark:text-white'>
                {loading ? '-' : stats.nominations}
              </span>
              <span className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                submissions
              </span>
            </dd>
            <div className='mt-4'>
              <Link
                href='/admin/nominations'
                className='text-sm font-medium text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300'>
                View all &rarr;
              </Link>
            </div>
          </div>

          {/* Pending Review Card */}
          <div className='overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'>
            <dt className='truncate text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary'>
              Pending Review
            </dt>
            <dd className='mt-2 flex items-baseline gap-2'>
              <span className='text-3xl font-semibold tracking-tight text-yellow-600'>
                {loading ? '-' : stats.pendingNominations}
              </span>
              <span className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                needs action
              </span>
            </dd>
            <div className='mt-4'>
              <Link
                href='/admin/nominations'
                className='text-sm font-medium text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300'>
                Review now &rarr;
              </Link>
            </div>
          </div>

          {/* Votes Card */}
          <div className='overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'>
            <dt className='truncate text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary'>
              Total Votes Cast
            </dt>
            <dd className='mt-2 flex items-baseline gap-2'>
              <span className='text-3xl font-semibold tracking-tight text-gray-900 dark:text-white'>
                {loading ? '-' : stats.votes}
              </span>
            </dd>
            <div className='mt-4'>
              <span className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                Live counts
              </span>
            </div>
          </div>

          {/* Staff/Categories Summary */}
          <div className='overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'>
            <div className='flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4 mb-4'>
              <span className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                Categories
              </span>
              <span className='font-bold text-gray-900 dark:text-white'>
                {loading ? '-' : stats.categories}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                Staff Members
              </span>
              <span className='font-bold text-gray-900 dark:text-white'>
                {loading ? '-' : stats.staff}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className='text-lg font-semibold text-gray-900 dark:text-white mt-10 mb-4'>
          Quick Actions
        </h2>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <Link
            href='/admin/categories/create'
            className='flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 transition-colors group'>
            <div className='p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors'>
              <span className='material-symbols-outlined'>add_circle</span>
            </div>
            <div>
              <h3 className='font-semibold text-gray-900 dark:text-white'>
                Create Category
              </h3>
              <p className='text-xs text-text-light-secondary dark:text-text-dark-secondary'>
                Add a new award category
              </p>
            </div>
          </Link>
          <Link
            href='/admin/staff/create'
            className='flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 transition-colors group'>
            <div className='p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors'>
              <span className='material-symbols-outlined'>person_add</span>
            </div>
            <div>
              <h3 className='font-semibold text-gray-900 dark:text-white'>
                Add Staff
              </h3>
              <p className='text-xs text-text-light-secondary dark:text-text-dark-secondary'>
                Onboard a new employee
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
