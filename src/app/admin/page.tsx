'use client';

import { mockNominations, mockCategories } from '@/data/mockData';

export default function AdminDashboard() {
  const activeNominations = mockNominations.filter(
    (n) => n.status === 'pending'
  ).length;
  const activeVoting = 0;
  const completedAwards = 0;

  return (
    <main className='flex flex-1 flex-col overflow-y-auto'>
      <div className='p-6 lg:p-8'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-text-light-primary dark:text-text-dark-primary'>
            Dashboard
          </h1>
          <p className='text-text-light-secondary dark:text-text-dark-secondary mt-1'>
            Welcome to the Staff Awards Admin Panel
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8'>
          <div className='bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark'>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30'>
                <span className='material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400'>
                  rate_review
                </span>
              </div>
              <div>
                <p className='text-2xl font-bold text-text-light-primary dark:text-text-dark-primary'>
                  {activeNominations}
                </p>
                <p className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                  Active Nominations
                </p>
              </div>
            </div>
          </div>

          <div className='bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark'>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30'>
                <span className='material-symbols-outlined text-2xl text-green-600 dark:text-green-400'>
                  how_to_vote
                </span>
              </div>
              <div>
                <p className='text-2xl font-bold text-text-light-primary dark:text-text-dark-primary'>
                  {activeVoting}
                </p>
                <p className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                  Active Voting
                </p>
              </div>
            </div>
          </div>

          <div className='bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark'>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30'>
                <span className='material-symbols-outlined text-2xl text-purple-600 dark:text-purple-400'>
                  workspace_premium
                </span>
              </div>
              <div>
                <p className='text-2xl font-bold text-text-light-primary dark:text-text-dark-primary'>
                  {completedAwards}
                </p>
                <p className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                  Completed Awards
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark'>
          <div className='p-6 border-b border-border-light dark:border-border-dark'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-text-light-primary dark:text-text-dark-primary'>
                Recent Nominations
              </h2>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary'>
                    search
                  </span>
                  <input
                    type='text'
                    className='w-full rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark py-2 pl-10 pr-4 text-sm focus:border-primary focus:ring-primary'
                    placeholder='Search nominations...'
                  />
                </div>
                <button className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 cursor-pointer'>
                  <span className='material-symbols-outlined text-lg'>add</span>
                  <span className='truncate'>New Nomination</span>
                </button>
              </div>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light-secondary dark:text-text-dark-secondary'>
                    Nominee
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light-secondary dark:text-text-dark-secondary'>
                    Category
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light-secondary dark:text-text-dark-secondary'>
                    Date
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light-secondary dark:text-text-dark-secondary'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-light-secondary dark:text-text-dark-secondary'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border-light dark:divide-border-dark'>
                {mockNominations.map((nomination) => (
                  <tr
                    key={nomination.id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-800/30'>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='flex items-center'>
                        <div className='h-10 w-10 shrink-0'>
                          <img
                            className='h-10 w-10 rounded-full object-cover'
                            src={nomination.nominee.avatar}
                            alt={nomination.nominee.name}
                          />
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-semibold text-text-light-primary dark:text-text-dark-primary'>
                            {nomination.nominee.name}
                          </div>
                          <div className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                            {nomination.nominee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                      {nomination.category.title}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                      {new Date(nomination.submittedAt).toLocaleDateString()}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          nomination.status === 'pending'
                            ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
                            : nomination.status === 'approved'
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                        }`}>
                        {nomination.status.charAt(0).toUpperCase() +
                          nomination.status.slice(1)}
                      </span>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-right text-sm font-medium'>
                      <a
                        href='#'
                        className='text-primary hover:text-primary/80'>
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
