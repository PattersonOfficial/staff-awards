'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import AwardCategoryCard from '@/components/ui/AwardCategoryCard';
import SearchBar from '@/components/ui/SearchBar';
import { mockCategories } from '@/data/mockData';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = mockCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='relative flex min-h-screen w-full flex-col bg-[#F8F9FA] dark:bg-background-dark'>
      <Header />
      <main className='flex w-full flex-1 flex-col items-center px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
        <div className='w-full max-w-7xl'>
          <div className='mb-8'>
            <h1 className='text-4xl font-black tracking-tighter text-[#212529] dark:text-text-dark-primary'>
              2024 Staff Awards
            </h1>
            <p className='mt-2 text-lg text-[#6c757d] dark:text-text-dark-secondary'>
              Select a category below to nominate a colleague.
            </p>
          </div>

          <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-center'>
            <SearchBar
              placeholder='Search for a category...'
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <div className='flex flex-wrap gap-2'>
              <button className='flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-3 hover:bg-gray-50 dark:hover:bg-gray-800'>
                <p className='text-sm font-medium text-text-light-primary dark:text-text-dark-primary'>
                  Filter by Department
                </p>
                <span className='material-symbols-outlined text-base'>
                  expand_more
                </span>
              </button>
              <button className='flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-3 hover:bg-gray-50 dark:hover:bg-gray-800'>
                <p className='text-sm font-medium text-text-light-primary dark:text-text-dark-primary'>
                  Sort by Deadline
                </p>
                <span className='material-symbols-outlined text-base'>
                  expand_more
                </span>
              </button>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filteredCategories.map((category) => (
              <AwardCategoryCard key={category.id} category={category} />
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-text-light-secondary dark:text-text-dark-secondary'>
                No categories found matching your search.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
