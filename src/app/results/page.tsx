'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Avatar from '@/components/ui/Avatar';
import { VotingResult } from '@/types';
import { getCategories, Category } from '@/supabase/services/categories';
import { getStaff } from '@/supabase/services/staff';
import { getVoteCounts } from '@/supabase/services/votes';
import { AwardCategory } from '@/types';

// Helper to map Supabase Category to AwardCategory
const mapCategory = (cat: Category): AwardCategory => ({
  id: cat?.id,
  title: cat?.title,
  description: cat?.description ?? '',
  image: cat?.image ?? '',
  type: cat?.type,
  department: cat?.department ?? '',
  nominationDeadline: cat?.nomination_end ?? cat?.nomination_deadline ?? '',
  status: cat?.status as 'draft' | 'published' | 'closed',
  shortlistingStart: cat.shortlisting_start,
  shortlistingEnd: cat.shortlisting_end,
  votingStart: cat.voting_start,
  votingEnd: cat.voting_end,
});

export default function ResultsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>(
    'all'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [results, setResults] = useState<VotingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const filterRef = useRef<HTMLDivElement>(null);

  // Fetch real data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // 1. Fetch Categories and Staff
        const [categories, staffList] = await Promise.all([
          getCategories(),
          getStaff(),
        ]);

        const staffMap = new Map(staffList?.map((s) => [s.id, s]));

        // 2. Build Results for each category
        const resultsData: VotingResult[] = [];

        for (const cat of categories) {
          // Only show results for closed or published categories? Or all?
          // Usually results are shown after voting closes.
          // For now, let's show all that have votes to demonstrate functionality.

          // Get raw vote counts (nomineeId -> count)
          const votes = await getVoteCounts(cat.id);

          if (votes.length === 0) continue; // Skip categories with no votes

          const totalVotes = votes.reduce((sum, v) => sum + v.count, 0);

          // Map to Nominee Result
          const nominees = votes
            .map((v) => {
              const staff = staffMap.get(v.nomineeId);
              // Calculate percentage
              const percentage =
                totalVotes > 0
                  ? parseFloat(((v.count / totalVotes) * 100).toFixed(1))
                  : 0;

              return {
                nominee: {
                  id: v.nomineeId,
                  name: staff?.name || '',
                  position: staff?.position || '',
                  department: staff?.department || '',
                  avatar: staff?.avatar || '',
                  email: staff?.email || '',
                  role: staff?.role || 'staff',
                  joinedAt: staff?.created_at || '',
                },
                voteCount: v.count,
                percentage,
              };
            })
            .sort((a, b) => b.voteCount - a.voteCount); // Sort by highest votes

          resultsData.push({
            categoryId: cat.id,
            category: mapCategory(cat),
            nominees,
            totalVotes,
            status: 'completed',
            winnerId: cat.winner_id || null, // Include the official winner ID
          });
        }

        setResults(resultsData);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredResults =
    selectedCategory === 'all'
      ? results
      : results.filter((result) => result.categoryId === selectedCategory);

  const categoriesWithResults = results.map((r) => r.category);

  const selectedCategoryName =
    selectedCategory === 'all'
      ? 'All Categories'
      : categoriesWithResults.find((c) => c.id === selectedCategory)?.title ||
        'All Categories';

  const totalVotesAcrossAll = results.reduce(
    (acc, result) => acc + result.totalVotes,
    0
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-[#F8F9FA] dark:bg-background-dark'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='relative flex min-h-screen w-full flex-col bg-[#F8F9FA] dark:bg-background-dark'>
      <Header />
      <main className='flex w-full flex-1 flex-col items-center px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
        <div className='w-full max-w-7xl'>
          <div className='mb-8 text-center'>
            <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mb-4 shadow-lg'>
              <span className='material-symbols-outlined text-5xl text-white'>
                emoji_events
              </span>
            </div>
            <h1 className='text-4xl font-black tracking-tighter text-[#212529] dark:text-text-dark-primary'>
              2025 Awards Results
            </h1>
            <p className='mt-2 text-lg text-[#6c757d] dark:text-text-dark-secondary'>
              Congratulations to all our winners and nominees!
            </p>
          </div>

          <div className='mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4'>
            <div className='relative flex-1 max-w-md' ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className='w-full flex items-center justify-between gap-2 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer'>
                <div className='flex items-center gap-2'>
                  <span className='material-symbols-outlined text-[#0A4D68] dark:text-primary'>
                    filter_list
                  </span>
                  <span className='font-semibold text-[#212529] dark:text-white'>
                    {selectedCategoryName}
                  </span>
                </div>
                <span className='material-symbols-outlined text-gray-400'>
                  {isFilterOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {isFilterOpen && (
                <div className='absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl z-50 max-h-96 overflow-y-auto'>
                  <div className='p-2'>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                        selectedCategory === 'all'
                          ? 'bg-[#0A4D68] text-white'
                          : 'text-[#212529] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}>
                      All Categories ({results.length})
                    </button>
                    {categoriesWithResults.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                          selectedCategory === category.id
                            ? 'bg-[#0A4D68] text-white'
                            : 'text-[#212529] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}>
                        <div className='flex items-center justify-between'>
                          <span>{category.title}</span>
                          <span className='text-xs opacity-60'>
                            {category.type}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-2 text-sm text-[#6c757d] dark:text-gray-400'>
                <span className='material-symbols-outlined text-lg'>
                  how_to_vote
                </span>
                <span className='font-medium'>
                  {selectedCategory === 'all'
                    ? totalVotesAcrossAll
                    : filteredResults.reduce(
                        (acc, result) => acc + result.totalVotes,
                        0
                      )}{' '}
                  total votes
                </span>
              </div>
              <div className='flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700'>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 pb-0! rounded-md transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#0A4D68] text-white'
                      : 'text-[#6c757d] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title='Detailed view'>
                  <span className='material-symbols-outlined'>view_agenda</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 pb-0! rounded-md transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#0A4D68] text-white'
                      : 'text-[#6c757d] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title='Compact view'>
                  <span className='material-symbols-outlined'>grid_view</span>
                </button>
              </div>
            </div>
          </div>

          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'grid grid-cols-1 gap-8'
            }>
            {filteredResults.map((result) => (
              <div
                key={result.categoryId}
                className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden hover:shadow-xl transition-shadow'>
                <div
                  className={`${
                    viewMode === 'grid' ? 'h-32' : 'h-48'
                  } bg-cover bg-center relative`}
                  style={{ backgroundImage: `url(${result.category.image})` }}>
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent' />
                  <div
                    className={`absolute ${
                      viewMode === 'grid'
                        ? 'bottom-3 left-4 right-4'
                        : 'bottom-6 left-6 right-6'
                    }`}>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white border border-white/30'>
                        {result.category.type}
                      </span>
                      {result.category.department && viewMode === 'list' && (
                        <span className='inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white border border-white/30'>
                          {result.category.department}
                        </span>
                      )}
                    </div>
                    <h2
                      className={`${
                        viewMode === 'grid'
                          ? 'text-lg line-clamp-1'
                          : 'text-3xl'
                      } font-black text-white mb-1`}>
                      {result.category.title}
                    </h2>
                    {viewMode === 'list' && (
                      <p className='text-white/90 text-sm'>
                        {result.totalVotes} votes cast
                      </p>
                    )}
                  </div>
                </div>

                <div className={viewMode === 'grid' ? 'p-4' : 'p-6 lg:p-8'}>
                  {viewMode === 'grid' ? (
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2 text-xs text-[#6c757d] dark:text-gray-400 mb-3'>
                        <span className='material-symbols-outlined text-sm'>
                          how_to_vote
                        </span>
                        <span>{result.totalVotes} votes</span>
                      </div>
                      {result.nominees.map((nominee, nomineeIndex) => (
                        <div
                          key={nominee.nominee.id}
                          className={`flex items-center gap-3 ${
                            nomineeIndex === 0
                              ? 'bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/10 dark:to-transparent border border-yellow-400 dark:border-yellow-600 rounded-lg p-3'
                              : 'pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0'
                          }`}>
                          <div className='relative shrink-0'>
                            <Avatar
                              src={nominee.nominee.avatar}
                              name={nominee.nominee.name}
                              className={`${
                                nomineeIndex === 0
                                  ? 'w-12 h-12 ring-2 ring-yellow-400 dark:ring-yellow-600'
                                  : 'w-10 h-10'
                              }`}
                            />
                            <div
                              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 ${
                                nomineeIndex === 0
                                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                                  : 'bg-gradient-to-br from-gray-400 to-gray-600'
                              }`}>
                              <span className='text-white text-[10px] font-bold'>
                                {nomineeIndex + 1}
                              </span>
                            </div>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h4
                              className={`${
                                nomineeIndex === 0 ? 'text-base' : 'text-sm'
                              } font-bold text-[#212529] dark:text-white truncate flex items-center gap-1.5`}>
                              {nominee.nominee.name}
                              {nomineeIndex === 0 &&
                                result.winnerId === nominee.nominee.id && (
                                  <span className='inline-flex items-center gap-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full'>
                                    <span
                                      className='material-symbols-outlined text-xs'
                                      style={{
                                        fontVariationSettings: "'FILL' 1",
                                      }}>
                                      verified
                                    </span>
                                    Official
                                  </span>
                                )}
                            </h4>
                            <div className='flex items-center gap-2'>
                              <div className='flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden'>
                                <div
                                  className={`h-full rounded-full ${
                                    nomineeIndex === 0
                                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                                      : 'bg-gradient-to-r from-gray-400 to-gray-600'
                                  }`}
                                  style={{ width: `${nominee.percentage}%` }}
                                />
                              </div>
                              <span
                                className={`${
                                  nomineeIndex === 0
                                    ? 'text-yellow-600 dark:text-yellow-500 text-sm'
                                    : 'text-[#6c757d] dark:text-gray-400 text-xs'
                                } font-bold shrink-0`}>
                                {nominee.percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='space-y-6'>
                      {result.nominees.map((nominee, nomineeIndex) => (
                        <div
                          key={nominee.nominee.id}
                          className={`relative ${
                            nomineeIndex === 0
                              ? 'bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/10 dark:to-transparent border-2 border-yellow-400 dark:border-yellow-600 rounded-xl p-6'
                              : 'border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0'
                          }`}>
                          {nomineeIndex === 0 && (
                            <div className='absolute -top-3 -right-3 lg:-right-6'>
                              <div className='relative'>
                                <div className='w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-xl'>
                                  <span className='material-symbols-outlined text-3xl lg:text-4xl text-white'>
                                    emoji_events
                                  </span>
                                </div>
                                <div className='absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800'>
                                  <span className='text-white text-xs font-bold'>
                                    1
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className='flex flex-col md:flex-row md:items-center gap-4'>
                            <div className='flex items-center gap-4 flex-1'>
                              <div className='relative'>
                                <Avatar
                                  src={nominee.nominee.avatar}
                                  name={nominee.nominee.name}
                                  className={`${
                                    nomineeIndex === 0
                                      ? 'w-20 h-20 lg:w-24 lg:h-24 ring-4 ring-yellow-400 dark:ring-yellow-600'
                                      : 'w-16 h-16 lg:w-20 lg:h-20'
                                  }`}
                                  textClassName={
                                    nomineeIndex === 0 ? 'text-3xl' : 'text-2xl'
                                  }
                                />
                                {nomineeIndex > 0 && (
                                  <div className='absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg'>
                                    <span className='text-white text-sm font-bold'>
                                      {nomineeIndex + 1}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className='flex-1 min-w-0'>
                                <h3
                                  className={`${
                                    nomineeIndex === 0
                                      ? 'text-2xl lg:text-3xl'
                                      : 'text-xl lg:text-2xl'
                                  } font-bold text-[#212529] dark:text-white mb-1 flex items-center gap-2 flex-wrap`}>
                                  {nominee.nominee.name}
                                  {nomineeIndex === 0 &&
                                    result.winnerId === nominee.nominee.id && (
                                      <span className='inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full'>
                                        <span
                                          className='material-symbols-outlined text-sm'
                                          style={{
                                            fontVariationSettings: "'FILL' 1",
                                          }}>
                                          verified
                                        </span>
                                        Official Winner
                                      </span>
                                    )}
                                </h3>
                                <p className='text-sm text-[#6c757d] dark:text-gray-400'>
                                  {nominee.nominee.position}
                                </p>
                                <p className='text-xs text-[#6c757d] dark:text-gray-500 mt-0.5'>
                                  {nominee.nominee.department}
                                </p>
                              </div>
                            </div>

                            <div className='flex items-center gap-4'>
                              <div className='text-right'>
                                <div
                                  className={`${
                                    nomineeIndex === 0
                                      ? 'text-3xl lg:text-4xl text-yellow-600 dark:text-yellow-500'
                                      : 'text-2xl lg:text-3xl text-[#212529] dark:text-white'
                                  } font-black`}>
                                  {nominee.percentage}%
                                </div>
                                <div className='text-xs text-[#6c757d] dark:text-gray-400 font-medium'>
                                  {nominee.voteCount} votes
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className='mt-4'>
                            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden'>
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  nomineeIndex === 0
                                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                                    : 'bg-gradient-to-r from-gray-400 to-gray-600'
                                }`}
                                style={{ width: `${nominee.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredResults.length === 0 && (
            <div className='text-center py-16'>
              <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4'>
                <span className='material-symbols-outlined text-5xl text-gray-400'>
                  pending
                </span>
              </div>
              <h3 className='text-2xl font-bold text-[#212529] dark:text-text-dark-primary mb-2'>
                No Results Available
              </h3>
              <p className='text-[#6c757d] dark:text-text-dark-secondary'>
                Results will appear here once voting has taken place.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
