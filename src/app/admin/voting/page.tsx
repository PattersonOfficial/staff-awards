'use client';

import { useState, useEffect } from 'react';
import PublishWinnerModal from '@/components/ui/PublishWinnerModal';
import Avatar from '@/components/ui/Avatar';
import { getCategories, Category } from '@/supabase/services/categories';
import { getVoteCounts, VoteCount } from '@/supabase/services/votes';
import { getStaff, StaffMember } from '@/supabase/services/staff';

interface FormattedVoteData {
  staff: {
    id: string;
    name: string;
    department: string;
    avatar?: string;
  };
  voteCount: number;
  percentage: string;
}

export default function VotingResultsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [voteData, setVoteData] = useState<FormattedVoteData[]>([]);
  const [loading, setLoading] = useState(true);

  // State for publish status
  const [isPublished, setIsPublished] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const cats = await getCategories();
        if (cats && cats.length > 0) {
          setCategories(cats);
          setSelectedCategoryId(cats[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  useEffect(() => {
    async function fetchCategoryResults() {
      if (!selectedCategoryId) return;

      try {
        const [counts, staffList] = await Promise.all([
          getVoteCounts(selectedCategoryId),
          getStaff(),
        ]);

        const totalVotes = counts.reduce(
          (sum: number, item: VoteCount) => sum + item.count,
          0
        );

        // Optimize staff lookup
        const staffMap = new Map<string, StaffMember>();
        if (staffList) {
          staffList.forEach((s) => staffMap.set(s.id, s));
        }

        const formattedData: FormattedVoteData[] = counts.map(
          (item: VoteCount) => {
            const staffMember = staffMap.get(item.nomineeId);
            return {
              staff: {
                id: item.nomineeId,
                name: staffMember?.name || 'Unknown Nominee',
                department: staffMember?.department || 'Unknown',
                avatar: staffMember?.avatar || undefined,
              },
              voteCount: item.count,
              percentage:
                totalVotes > 0
                  ? ((item.count / totalVotes) * 100).toFixed(2)
                  : '0.00',
            };
          }
        );

        // Sort by vote count desc
        formattedData.sort((a, b) => b.voteCount - a.voteCount);

        setVoteData(formattedData);
      } catch (error) {
        console.error('Error fetching vote counts:', error);
      }
    }

    if (selectedCategoryId) {
      fetchCategoryResults();
      setIsPublished(false); // Reset publish state on change
    }
  }, [selectedCategoryId]);

  const totalVotes = voteData.reduce((sum, item) => sum + item.voteCount, 0);
  const finalists = voteData; // In real app, we might limit to top N

  const handleExportCSV = () => {
    if (!selectedCategory) return;

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

  if (loading) {
    return (
      <div className='p-8 text-center text-gray-500'>Loading results...</div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className='p-8 text-center text-gray-500'>No categories found.</div>
    );
  }

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
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
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
                            <Avatar
                              src={item.staff.avatar}
                              name={item.staff.name}
                              className='h-10 w-10'
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
