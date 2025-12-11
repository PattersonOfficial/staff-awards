'use client';

import { useEffect, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import {
  getCategories,
  Category,
  publishWinner,
} from '@/supabase/services/categories';
import { getStaff, StaffMember } from '@/supabase/services/staff';
import { getVoteCounts } from '@/supabase/services/votes';
import { useToast } from '@/context/ToastContext';
import PublishWinnerModal from '@/components/ui/PublishWinnerModal';

type Result = {
  nomineeId: string;
  nomineeName: string;
  nomineeAvatar: string;
  nomineeDepartment: string;
  count: number;
};

type CategoryResult = {
  category: Category;
  results: Result[];
  totalVotes: number;
};

// Icon mapping for categories
const getCategoryIcon = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('innovator') || lowerTitle.includes('innovation'))
    return 'emoji_events';
  if (lowerTitle.includes('employee')) return 'star';
  if (lowerTitle.includes('team')) return 'groups';
  if (lowerTitle.includes('leadership') || lowerTitle.includes('leader'))
    return 'workspace_premium';
  if (lowerTitle.includes('customer') || lowerTitle.includes('service'))
    return 'support_agent';
  if (lowerTitle.includes('mentor')) return 'school';
  return 'military_tech';
};

export default function AdminResultsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [categoryResults, setCategoryResults] = useState<
    Map<string, CategoryResult>
  >(new Map());
  const [staffMap, setStaffMap] = useState<Map<string, StaffMember>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  // Publish winner state
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const { toast } = useToast();

  // Initial load - fetch categories and staff
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        const [categoriesData, staffData] = await Promise.all([
          getCategories(),
          getStaff(),
        ]);

        setCategories(categoriesData);
        setStaffMap(new Map(staffData?.map((s) => [s.id, s])));

        // Select first category by default
        if (categoriesData.length > 0) {
          setSelectedCategoryId(categoriesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  // Fetch results when category is selected
  useEffect(() => {
    async function fetchCategoryResults() {
      if (!selectedCategoryId || staffMap.size === 0) return;

      // Check if already cached
      if (categoryResults.has(selectedCategoryId)) return;

      try {
        setLoadingResults(true);
        const category = categories.find((c) => c.id === selectedCategoryId);
        if (!category) return;

        const votes = await getVoteCounts(selectedCategoryId);

        const results: Result[] = votes
          .map((v) => {
            const staff = staffMap.get(v.nomineeId);
            return {
              nomineeId: v.nomineeId,
              nomineeName: staff?.name || 'Unknown',
              nomineeAvatar: staff?.avatar || '',
              nomineeDepartment: staff?.department || '',
              count: v.count,
            };
          })
          .sort((a, b) => b.count - a.count);

        const newResult: CategoryResult = {
          category,
          results,
          totalVotes: results.reduce((sum, r) => sum + r.count, 0),
        };

        setCategoryResults((prev) =>
          new Map(prev).set(selectedCategoryId, newResult)
        );
      } catch (error) {
        console.error('Error fetching category results:', error);
      } finally {
        setLoadingResults(false);
      }
    }

    fetchCategoryResults();
  }, [selectedCategoryId, categories, staffMap, categoryResults]);

  const currentResult = selectedCategoryId
    ? categoryResults.get(selectedCategoryId)
    : null;

  const handleExport = () => {
    if (!currentResult || currentResult.results.length === 0) return;

    const headers = ['Nominee', 'Department', 'Vote Count', 'Vote Share (%)'];
    const rows = currentResult.results.map((r) => {
      const percentage =
        currentResult.totalVotes > 0
          ? ((r.count / currentResult.totalVotes) * 100).toFixed(2)
          : '0.00';
      return [
        `"${r.nomineeName}"`,
        `"${r.nomineeDepartment}"`,
        r.count,
        percentage,
      ].join(',');
    });

    const csvContent = [
      `Category: ${currentResult.category.title}`,
      `Total Votes: ${currentResult.totalVotes}`,
      '',
      headers.join(','),
      ...rows,
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${currentResult.category.title.replace(/\s+/g, '_')}_results.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get max votes for bar scaling
  const maxVotes = currentResult
    ? Math.max(...currentResult.results.map((r) => r.count), 1)
    : 1;

  // Get the leading nominee (potential winner)
  const leadingNominee = currentResult?.results?.[0];
  // Check if winner exists (handle both null and undefined)
  const hasWinner = Boolean(currentResult?.category?.winner_id);

  const handlePublishWinner = async () => {
    if (!currentResult || !leadingNominee) return;

    try {
      setPublishing(true);
      await publishWinner(currentResult.category.id, leadingNominee.nomineeId);

      // Update local state
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === currentResult.category.id
            ? { ...cat, winner_id: leadingNominee.nomineeId, status: 'closed' }
            : cat
        )
      );

      // Update category results cache
      setCategoryResults((prev) => {
        const updated = new Map(prev);
        const result = updated.get(currentResult.category.id);
        if (result) {
          updated.set(currentResult.category.id, {
            ...result,
            category: {
              ...result.category,
              winner_id: leadingNominee.nomineeId,
              status: 'closed',
            },
          });
        }
        return updated;
      });

      toast.success(`Winner published: ${leadingNominee.nomineeName}`);
      setPublishModalOpen(false);
    } catch (error) {
      console.error('Error publishing winner:', error);
      toast.error('Failed to publish winner. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='flex flex-1 h-full'>
      {/* Left Sidebar - Categories Navigation */}
      <aside className='w-64 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hidden md:flex flex-col'>
        <div className='flex flex-col gap-4'>
          <div className='flex gap-3 px-2 py-1 items-center'>
            <div className='flex flex-col'>
              <h1 className='text-gray-900 dark:text-white text-base font-medium leading-normal'>
                Statistics
              </h1>
              <p className='text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal'>
                Voting Results
              </p>
            </div>
          </div>

          <nav className='flex flex-col gap-2 mt-4'>
            {categories.map((cat) => {
              const isSelected = cat.id === selectedCategoryId;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}>
                  <span
                    className={`material-symbols-outlined text-2xl ${
                      isSelected
                        ? 'text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                    style={
                      isSelected
                        ? { fontVariationSettings: "'FILL' 1" }
                        : undefined
                    }>
                    {getCategoryIcon(cat.title)}
                  </span>
                  <p
                    className={`text-sm leading-normal truncate ${
                      isSelected
                        ? 'text-white font-bold'
                        : 'text-gray-900 dark:text-white font-medium'
                    }`}>
                    {cat.title}
                  </p>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className='flex-1 p-4 md:p-8 overflow-y-auto'>
        <div className='w-full max-w-5xl mx-auto'>
          {!currentResult && !loadingResults ? (
            <div className='flex flex-col items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-12 text-center'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 mb-4'>
                <span className='material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400'>
                  poll
                </span>
              </div>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-1'>
                Select a Category
              </h3>
              <p className='text-gray-500 dark:text-gray-400 max-w-sm'>
                Choose an award category from the sidebar to view voting
                results.
              </p>
            </div>
          ) : loadingResults ? (
            <div className='flex justify-center p-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
            </div>
          ) : currentResult ? (
            <>
              {/* Page Heading & Actions */}
              <div className='flex flex-wrap justify-between items-start gap-4 mb-6'>
                <div className='flex min-w-72 flex-col gap-2'>
                  <p className='text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]'>
                    {currentResult.category.title}
                  </p>
                  <div className='flex items-center gap-2'>
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        currentResult.category.status === 'closed'
                          ? 'bg-red-500'
                          : currentResult.category.status === 'published'
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      }`}></span>
                    <p
                      className={`text-sm font-medium leading-normal ${
                        currentResult.category.status === 'closed'
                          ? 'text-red-500'
                          : currentResult.category.status === 'published'
                          ? 'text-green-500'
                          : 'text-yellow-500'
                      }`}>
                      {currentResult.category.status === 'closed'
                        ? 'Voting Closed'
                        : currentResult.category.status === 'published'
                        ? 'Voting Open'
                        : 'Draft'}
                    </p>
                  </div>
                </div>
                <div className='flex flex-wrap justify-start sm:justify-end flex-1 gap-3'>
                  <button
                    onClick={handleExport}
                    disabled={currentResult.results.length === 0}
                    className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold leading-normal hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50'>
                    <span className='material-symbols-outlined mr-2 text-base'>
                      ios_share
                    </span>
                    <span className='truncate'>Export as CSV</span>
                  </button>
                  {hasWinner ? (
                    <div className='flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg'>
                      <span className='material-symbols-outlined text-base'>
                        emoji_events
                      </span>
                      <span className='text-sm font-bold'>
                        Winner Published
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setPublishModalOpen(true)}
                      disabled={
                        !leadingNominee ||
                        currentResult.results.length === 0 ||
                        publishing
                      }
                      className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'>
                      <span className='material-symbols-outlined mr-2 text-base'>
                        military_tech
                      </span>
                      <span className='truncate'>
                        {publishing ? 'Publishing...' : 'Publish Winner'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chart Card */}
              <div className='flex flex-col gap-2 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm mb-6'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-gray-900 dark:text-white text-lg font-semibold leading-normal'>
                      Live Vote Distribution
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal'>
                      Total Votes: {currentResult.totalVotes.toLocaleString()}
                    </p>
                  </div>
                  <div className='flex gap-1 items-center'>
                    <p className='text-gray-400 dark:text-gray-500 text-xs font-normal leading-normal'>
                      Last updated: Just now
                    </p>
                  </div>
                </div>

                {currentResult.results.length === 0 ? (
                  <div className='py-12 text-center text-gray-500'>
                    No votes cast yet for this category.
                  </div>
                ) : (
                  <div className='mt-4 grid min-h-[180px] gap-x-4 gap-y-2 grid-cols-[auto_1fr] items-center py-3'>
                    {currentResult.results.map((result) => {
                      const barWidth =
                        maxVotes > 0
                          ? Math.max((result.count / maxVotes) * 100, 5)
                          : 5;
                      return (
                        <>
                          <p
                            key={`name-${result.nomineeId}`}
                            className='text-gray-500 dark:text-gray-400 text-[13px] font-medium leading-normal truncate max-w-[120px]'>
                            {result.nomineeName}
                          </p>
                          <div
                            key={`bar-${result.nomineeId}`}
                            className='h-8 flex items-center rounded-lg bg-gray-100 dark:bg-gray-700'>
                            <div
                              className='bg-primary h-full rounded-lg flex items-center justify-end px-2 transition-all duration-500'
                              style={{ width: `${barWidth}%` }}>
                              <span className='text-white text-xs font-bold'>
                                {result.count}
                              </span>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Nominee Results Table */}
              {currentResult.results.length > 0 && (
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden'>
                  <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left'>
                      <thead className='text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900'>
                        <tr>
                          <th className='px-6 py-3 font-semibold' scope='col'>
                            Nominee
                          </th>
                          <th
                            className='px-6 py-3 font-semibold text-right'
                            scope='col'>
                            Vote Count
                          </th>
                          <th
                            className='px-6 py-3 font-semibold text-right'
                            scope='col'>
                            Vote Share (%)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentResult.results.map((result, index) => {
                          const percentage =
                            currentResult.totalVotes > 0
                              ? (
                                  (result.count / currentResult.totalVotes) *
                                  100
                                ).toFixed(2)
                              : '0.00';
                          const isWinner = index === 0 && result.count > 0;

                          return (
                            <tr
                              key={result.nomineeId}
                              className={`border-b border-gray-200 dark:border-gray-700 ${
                                isWinner
                                  ? 'bg-yellow-50/50 dark:bg-yellow-900/10'
                                  : ''
                              }`}>
                              <td className='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'>
                                <div className='flex items-center gap-4'>
                                  <Avatar
                                    src={result.nomineeAvatar}
                                    name={result.nomineeName}
                                    className='w-10 h-10'
                                  />
                                  <div>
                                    <div className='font-semibold flex items-center gap-2'>
                                      {result.nomineeName}
                                      {isWinner && (
                                        <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'>
                                          <span className='material-symbols-outlined text-xs mr-0.5'>
                                            emoji_events
                                          </span>
                                          Leader
                                        </span>
                                      )}
                                    </div>
                                    <div className='font-normal text-gray-500 dark:text-gray-400'>
                                      {result.nomineeDepartment ||
                                        'No Department'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className='px-6 py-4 text-right font-bold'>
                                {result.count}
                              </td>
                              <td className='px-6 py-4 text-right'>
                                {percentage}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </main>

      {/* Mobile Category Selector */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4'>
        <select
          value={selectedCategoryId || ''}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className='w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium'>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>
      {/* Publish Winner Modal */}
      <PublishWinnerModal
        isOpen={publishModalOpen}
        categoryTitle={currentResult?.category?.title || ''}
        onConfirm={handlePublishWinner}
        onClose={() => setPublishModalOpen(false)}
      />
    </div>
  );
}
