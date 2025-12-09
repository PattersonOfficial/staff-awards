'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import { mockCategories, mockStaff } from '@/data/mockData';
import { VotingResult } from '@/types';

const mockResults: VotingResult[] = [
  {
    categoryId: '1',
    category: mockCategories[0],
    nominees: [
      {
        nominee: mockStaff[0],
        voteCount: 245,
        percentage: 42.5,
      },
      {
        nominee: mockStaff[1],
        voteCount: 178,
        percentage: 30.9,
      },
      {
        nominee: mockStaff[3],
        voteCount: 153,
        percentage: 26.6,
      },
    ],
    totalVotes: 576,
    status: 'completed',
  },
  {
    categoryId: '2',
    category: mockCategories[1],
    nominees: [
      {
        nominee: mockStaff[2],
        voteCount: 312,
        percentage: 48.2,
      },
      {
        nominee: mockStaff[4],
        voteCount: 198,
        percentage: 30.6,
      },
      {
        nominee: mockStaff[6],
        voteCount: 137,
        percentage: 21.2,
      },
    ],
    totalVotes: 647,
    status: 'completed',
  },
  {
    categoryId: '3',
    category: mockCategories[2],
    nominees: [
      {
        nominee: mockStaff[5],
        voteCount: 289,
        percentage: 51.3,
      },
      {
        nominee: mockStaff[2],
        voteCount: 156,
        percentage: 27.7,
      },
      {
        nominee: mockStaff[7],
        voteCount: 118,
        percentage: 21.0,
      },
    ],
    totalVotes: 563,
    status: 'completed',
  },
];

export default function ResultsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>(
    'all'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const filteredResults =
    selectedCategory === 'all'
      ? mockResults
      : mockResults.filter((result) => result.categoryId === selectedCategory);

  const selectedCategoryName =
    selectedCategory === 'all'
      ? 'All Categories'
      : mockCategories.find((c) => c.id === selectedCategory)?.title ||
        'All Categories';

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
                      All Categories ({mockResults.length})
                    </button>
                    {mockCategories.map((category) => (
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
                  {filteredResults.reduce(
                    (acc, result) => acc + result.totalVotes,
                    0
                  )}{' '}
                  total votes
                </span>
              </div>
              <div className='flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700'>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#0A4D68] text-white'
                      : 'text-[#6c757d] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title='Detailed view'>
                  <span className='material-symbols-outlined'>view_agenda</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
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
            {filteredResults.map((result, index) => (
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
                            <div
                              className={`${
                                nomineeIndex === 0
                                  ? 'w-12 h-12 ring-2 ring-yellow-400 dark:ring-yellow-600'
                                  : 'w-10 h-10'
                              } rounded-full bg-cover bg-center`}
                              style={{
                                backgroundImage: `url(${nominee.nominee.avatar})`,
                              }}
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
                              } font-bold text-[#212529] dark:text-white truncate`}>
                              {nominee.nominee.name}
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
                                <div
                                  className={`${
                                    nomineeIndex === 0
                                      ? 'w-20 h-20 lg:w-24 lg:h-24 ring-4 ring-yellow-400 dark:ring-yellow-600'
                                      : 'w-16 h-16 lg:w-20 lg:h-20'
                                  } rounded-full bg-cover bg-center shrink-0`}
                                  style={{
                                    backgroundImage: `url(${nominee.nominee.avatar})`,
                                  }}
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
                                  } font-bold text-[#212529] dark:text-white mb-1`}>
                                  {nominee.nominee.name}
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
                Results for this category will be published soon.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
