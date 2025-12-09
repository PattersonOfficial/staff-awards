'use client';

import { mockNominations, mockCategories } from '@/data/mockData';

export default function AdminDashboard() {
  const activeNominations = mockNominations.filter(
    (n) => n.status === 'pending'
  ).length;
  // Mock data for other stats as they aren't in the current mockData
  const activeVoting = 5;
  const completedAwards = 24;
  const totalCategories = mockCategories.length;

  return (
    <main className='flex flex-1 flex-col overflow-y-auto'>
      {/* TopNavBar */}
      <header className='flex h-16 shrink-0 items-center justify-between border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-8'>
        <h2 className='text-lg font-bold text-text-light-primary dark:text-text-dark-primary'>
          Dashboard
        </h2>
        <div className='flex items-center gap-4'>
          <button className='relative rounded-full p-2 text-text-light-secondary dark:text-text-dark-secondary hover:bg-accent-light dark:hover:bg-accent-dark hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors cursor-pointer'>
            <span className='material-symbols-outlined'>notifications</span>
            <span className='absolute right-2 top-2 block h-2 w-2 rounded-full bg-red-500'></span>
          </button>
          <div
            className='bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10'
            data-alt='User avatar image'
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNbkBM34qZFMt2Bp68tCijB8JLpgi_kHd88ghG4IMvO6kjzDtnmxHmqRWvu2mcNMsLoGLrr7ROwky5EqG00fDkxDnDTQNYSWBkaqiHz7JwqxJfhXOdPw3vdZtASBFkaeu3mMkaOem7HElW7xuRrZ33-naGLbSTfRN9-Vf-TlfaQravPoEB8j8i-c1Sw2UnAa2w26rzqHgmTDVVgAiAtmCl8ql8MpkFtlN6vmNAtB6dcp3ZkFA7ggDWlAuzsejdaLjzCMYSL2RVFkSh")',
            }}></div>
        </div>
      </header>

      <div className='flex-1 p-8'>
        {/* Stats */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='flex flex-col gap-2 rounded-xl bg-card-light dark:bg-card-dark p-6 shadow-soft'>
            <p className='text-base font-medium text-text-light-secondary dark:text-text-dark-secondary'>
              Total Categories
            </p>
            <p className='text-3xl font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary'>
              {totalCategories}
            </p>
          </div>
          <div className='flex flex-col gap-2 rounded-xl bg-card-light dark:bg-card-dark p-6 shadow-soft'>
            <p className='text-base font-medium text-text-light-secondary dark:text-text-dark-secondary'>
              Active Nominations
            </p>
            <p className='text-3xl font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary'>
              {activeNominations}
            </p>
          </div>
          <div className='flex flex-col gap-2 rounded-xl bg-card-light dark:bg-card-dark p-6 shadow-soft'>
            <p className='text-base font-medium text-text-light-secondary dark:text-text-dark-secondary'>
              Active Voting
            </p>
            <p className='text-3xl font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary'>
              {activeVoting}
            </p>
          </div>
          <div className='flex flex-col gap-2 rounded-xl bg-card-light dark:bg-card-dark p-6 shadow-soft'>
            <p className='text-base font-medium text-text-light-secondary dark:text-text-dark-secondary'>
              Completed Awards
            </p>
            <p className='text-3xl font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary'>
              {completedAwards}
            </p>
          </div>
        </div>

        {/* Recent Nominations Section */}
        <div className='mt-8'>
          {/* SectionHeader & ToolBar */}
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <h2 className='text-xl font-bold text-text-light-primary dark:text-text-dark-primary'>
              Recent Nominations
            </h2>
            <div className='flex items-center gap-2'>
              <div className='relative w-full max-w-sm'>
                <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary'>
                  search
                </span>
                <input
                  className='w-full rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark py-2 pl-10 pr-4 text-sm focus:border-primary focus:ring-primary'
                  placeholder='Search nominations...'
                  type='text'
                />
              </div>
              <button className='flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/90'>
                <span className='material-symbols-outlined text-xl'>add</span>
                <span className='truncate'>New Nomination</span>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className='mt-4 overflow-hidden rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark shadow-soft'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-border-light dark:divide-border-dark'>
                <thead className='bg-background-light dark:bg-background-dark'>
                  <tr>
                    <th
                      className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-text-light-secondary dark:text-text-dark-secondary'
                      scope='col'>
                      Nominee Name
                    </th>
                    <th
                      className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-text-light-secondary dark:text-text-dark-secondary'
                      scope='col'>
                      Category
                    </th>
                    <th
                      className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-text-light-secondary dark:text-text-dark-secondary'
                      scope='col'>
                      Submission Date
                    </th>
                    <th
                      className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-text-light-secondary dark:text-text-dark-secondary'
                      scope='col'>
                      Status
                    </th>
                    <th className='relative px-6 py-3' scope='col'>
                      <span className='sr-only'>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border-light dark:divide-border-dark'>
                  {mockNominations.map((nomination) => (
                    <tr key={nomination.id}>
                      <td className='whitespace-nowrap px-6 py-4'>
                        <div className='flex items-center'>
                          <div className='h-10 w-10 shrink-0'>
                            <img
                              className='h-10 w-10 rounded-full object-cover'
                              data-alt={`Avatar of ${nomination.nominee.name}`}
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
                          {nomination.status === 'pending'
                            ? 'Pending Review'
                            : nomination.status === 'approved'
                            ? 'Approved'
                            : 'Rejected'}
                        </span>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-right text-sm font-medium'>
                        <a
                          className='text-primary hover:text-primary/80'
                          href='#'>
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
      </div>
    </main>
  );
}
