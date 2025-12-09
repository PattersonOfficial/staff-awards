'use client';

import { useState } from 'react';
import AdminHeader from '@/components/layout/AdminHeader';
import PublishWinnerModal from '@/components/ui/PublishWinnerModal';
import { mockCategories, mockStaff } from '@/data/mockData';

export default function VotingResultsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    mockCategories[0].id
  );

  const selectedCategory =
    mockCategories.find((c) => c.id === selectedCategoryId) ||
    mockCategories[0];

  // Mock voting data generation based on the selected category
  const generateMockResults = (categoryId: string) => {
    // Deterministic pseudo-random generation based on categoryId
    const seed = categoryId.charCodeAt(0);
    const totalVotes = 120 + seed * 5; // Randomish total

    // Pick 5 random staff as finalists
    const finalists = mockStaff.slice(0, 5).map((staff, index) => {
      const voteCount = Math.floor(totalVotes * (0.4 - index * 0.05)); // Descending votes
      return {
        staff,
        voteCount,
        percentage: ((voteCount / totalVotes) * 100).toFixed(2),
      };
    });

    return { totalVotes, finalists };
  };

  const { totalVotes, finalists } = generateMockResults(selectedCategoryId);

  // State for publish status
  const [isPublished, setIsPublished] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExportCSV = () => {
    // 1. Define CSV headers
    const headers = ['Nominee', 'Department', 'Vote Count', 'Vote Share (%)'];

    // 2. Format rows
    const rows = finalists.map((item) => [
      item.staff.name,
      item.staff.department,
      item.voteCount,
      item.percentage,
    ]);

    // 3. Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    // 4. Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `voting_results_${selectedCategory.title
        .replace(/\s+/g, '_')
        .toLowerCase()}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePublishClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmPublish = () => {
    setIsPublished(true);
    setIsModalOpen(false);
    // In a real app, this would make an API call to update the backend
  };

  return (
    <main className='flex flex-1 flex-col overflow-y-auto bg-background-light dark:bg-background-dark'>
      <PublishWinnerModal
        isOpen={isModalOpen}
        categoryTitle={selectedCategory.title}
        onConfirm={handleConfirmPublish}
        onClose={() => setIsModalOpen(false)}
      />

      <div className='flex flex-1 overflow-hidden'>
        {/* Secondary Sidebar - Category Selection */}
        <aside className='hidden w-64 flex-col border-r border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 md:flex overflow-y-auto'>
          <div className='flex flex-col gap-4'>
            <div className='px-2 py-1'>
              <h2 className='text-base font-medium text-text-light-primary dark:text-text-dark-primary'>
                Categories
              </h2>
              <p className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                Select to view results
              </p>
            </div>
            <nav className='flex flex-col gap-2'>
              {mockCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    setIsPublished(false); // Reset publish state when switching categories for demo
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    selectedCategoryId === category.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-light-primary dark:hover:text-text-dark-primary'
                  }`}>
                  <span
                    className={`material-symbols-outlined text-xl ${
                      selectedCategoryId === category.id ? 'fill-current' : ''
                    }`}
                    style={
                      selectedCategoryId === category.id
                        ? { fontVariationSettings: "'FILL' 1" }
                        : {}
                    }>
                    emoji_events
                  </span>
                  <span
                    className={`text-sm font-medium leading-normal line-clamp-1`}>
                    {category.title}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className='flex-1 overflow-y-auto p-4 md:p-8'>
          <div className='mx-auto max-w-5xl'>
            {/* Header & Actions */}
            <div className='mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start'>
              <div className='flex flex-col gap-2'>
                <h1 className='text-3xl font-black leading-tight tracking-[-0.033em] text-text-light-primary dark:text-text-dark-primary md:text-4xl'>
                  {selectedCategory.title}
                </h1>
                <div className='flex items-center gap-2'>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isPublished ? 'bg-green-600' : 'bg-red-600'
                    }`}></span>
                  <span
                    className={`text-sm font-medium ${
                      isPublished ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {isPublished ? 'Winner Published' : 'Voting Closed'}
                  </span>
                </div>
              </div>

              <div className='flex flex-wrap gap-3'>
                <button
                  onClick={handleExportCSV}
                  className='flex h-10 items-center justify-center gap-2 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-4 text-sm font-bold text-text-light-primary dark:text-text-dark-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                  <span className='material-symbols-outlined text-base'>
                    ios_share
                  </span>
                  <span>Export as CSV</span>
                </button>
                <button
                  onClick={handlePublishClick}
                  disabled={isPublished}
                  className={`flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold text-white transition-colors ${
                    isPublished
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90'
                  }`}>
                  <span className='material-symbols-outlined text-base'>
                    {isPublished ? 'check_circle' : 'military_tech'}
                  </span>
                  <span>{isPublished ? 'Published' : 'Publish Winner'}</span>
                </button>
              </div>
            </div>

            {/* Chart Card */}
            <div className='mb-6 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 shadow-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-semibold text-text-light-primary dark:text-text-dark-primary'>
                    Live Vote Distribution
                  </h3>
                  <p className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                    Total Votes: {totalVotes}
                  </p>
                </div>
                <p className='text-xs text-text-light-secondary dark:text-text-dark-secondary'>
                  Last updated: Just now
                </p>
              </div>

              <div className='mt-6 grid gap-x-4 gap-y-4 grid-cols-[auto_1fr] items-center'>
                {finalists.map((item) => (
                  <div key={item.staff.id} className='contents'>
                    <span className='text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary whitespace-nowrap w-32 truncate'>
                      {item.staff.name}
                    </span>
                    <div className='flex h-8 w-full items-center rounded-lg bg-gray-50 dark:bg-gray-800/50'>
                      <div
                        className='flex h-full items-center justify-end rounded-lg bg-primary px-2 transition-all duration-500'
                        style={{
                          width: `${Math.max(Number(item.percentage), 5)}%`,
                        }}>
                        <span className='text-xs font-bold text-white'>
                          {item.voteCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Results Table */}
            <div className='overflow-hidden rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark shadow-sm'>
              <div className='overflow-x-auto'>
                <table className='w-full text-left text-sm'>
                  <thead className='bg-gray-50 dark:bg-background-dark text-xs uppercase text-text-light-secondary dark:text-text-dark-secondary'>
                    <tr>
                      <th className='px-6 py-3 font-semibold'>Nominee</th>
                      <th className='px-6 py-3 text-right font-semibold'>
                        Vote Count
                      </th>
                      <th className='px-6 py-3 text-right font-semibold'>
                        Vote Share (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-border-light dark:divide-border-dark'>
                    {finalists.map((item) => (
                      <tr
                        key={item.staff.id}
                        className='hover:bg-gray-50 dark:hover:bg-gray-800/30'>
                        <td className='whitespace-nowrap px-6 py-4 font-medium text-text-light-primary dark:text-text-dark-primary'>
                          <div className='flex items-center gap-4'>
                            <img
                              className='h-10 w-10 rounded-full object-cover'
                              src={item.staff.avatar}
                              alt={item.staff.name}
                            />
                            <div>
                              <div className='font-semibold'>
                                {item.staff.name}
                              </div>
                              <div className='font-normal text-text-light-secondary dark:text-text-dark-secondary'>
                                {item.staff.department}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='whitespace-nowrap px-6 py-4 text-right font-medium text-text-light-primary dark:text-text-dark-primary'>
                          {item.voteCount}
                        </td>
                        <td className='whitespace-nowrap px-6 py-4 text-right font-medium text-text-light-primary dark:text-text-dark-primary'>
                          {item.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
