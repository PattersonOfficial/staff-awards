'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import AwardCategoryCard from '@/components/ui/AwardCategoryCard';
import SearchBar from '@/components/ui/SearchBar';
import {
  getCategories,
  Category as SupabaseCategory,
} from '@/supabase/services/categories';
import { AwardCategory } from '@/types';
import Link from 'next/link';

// Helper to map Supabase Category to AwardCategory
const mapCategory = (cat: SupabaseCategory): AwardCategory => ({
  id: cat?.id,
  title: cat?.title,
  description: cat?.description ?? '',
  image: cat?.image ?? '', // Fallback for image
  type: cat?.type,
  department: cat?.department ?? '', // Fallback for department
  nominationDeadline: cat?.nomination_end ?? cat?.nomination_deadline ?? '',
  status: cat?.status as 'draft' | 'published' | 'closed',
  shortlistingStart: cat?.shortlisting_start,
  shortlistingEnd: cat?.shortlisting_end,
  votingStart: cat?.voting_start,
  votingEnd: cat?.voting_end,
});

export default function Home() {
  const [categories, setCategories] = useState<AwardCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        if (data && data.length > 0) {
          // Filter out drafts if this is public view
          const publicCategories = data
            .filter((c) => c.status !== 'draft')
            .map(mapCategory);
          setCategories(publicCategories);
        } else {
          // Fallback if DB is empty for demo purposes, or keep empty
          // For now, let's show empty state if DB is empty to prove real data connection
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to mock on error? Or show empty?
        // Let's use mock for robustness if error occurs
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className='mb-8'>
            <h1 className='text-4xl font-black tracking-tighter text-[#212529] dark:text-text-dark-primary'>
              2025 Staff Awards
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
            <div className='flex flex-wrap items-center gap-2'>
              <button className='flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'>
                <p className='text-sm font-medium text-text-light-primary dark:text-text-dark-primary'>
                  Filter by Department
                </p>
                <span className='material-symbols-outlined text-base'>
                  expand_more
                </span>
              </button>
              <button className='flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'>
                <p className='text-sm font-medium text-text-light-primary dark:text-text-dark-primary'>
                  Sort by Deadline
                </p>
                <span className='material-symbols-outlined text-base'>
                  expand_more
                </span>
              </button>
              <div className='flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700'>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 pb-0! rounded-md transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#0A4D68] text-white'
                      : 'text-[#6c757d] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title='List view'>
                  <span className='material-symbols-outlined'>view_list</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 pb-0! rounded-md transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#0A4D68] text-white'
                      : 'text-[#6c757d] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title='Grid view'>
                  <span className='material-symbols-outlined'>grid_view</span>
                </button>
              </div>
            </div>
          </div>

          {filteredCategories.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-text-light-secondary dark:text-text-dark-secondary'>
                No categories found matching your search.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {filteredCategories.map((category) => (
                <AwardCategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4'>
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className='group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark shadow-sm transition-all duration-300 hover:shadow-lg'>
                  <div
                    className='w-full sm:w-48 h-40 sm:h-auto bg-center bg-no-repeat bg-cover shrink-0'
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className='flex flex-1 flex-col p-5'>
                    <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3'>
                      <div className='flex-1'>
                        <h3 className='text-lg font-bold text-[#212529] dark:text-text-dark-primary'>
                          {category.title}
                        </h3>
                        <p className='mt-1 text-sm text-[#6c757d] dark:text-text-dark-secondary'>
                          {category.description}
                        </p>
                      </div>
                      <Link
                        href={`/categories/${category.id}`}
                        className='sm:ml-4 rounded-lg bg-[#0A4D68] px-6 py-2.5 text-sm font-semibold text-white text-center transition-colors hover:opacity-90 whitespace-nowrap cursor-pointer'>
                        Nominate Now
                      </Link>
                    </div>
                    <div className='flex flex-wrap items-center gap-3'>
                      <div className='flex flex-wrap gap-2'>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            category.type === 'Individual Award'
                              ? 'bg-primary-accent/10 text-primary-accent'
                              : 'bg-green-500/10 text-green-600 dark:text-green-400'
                          }`}>
                          {category.type}
                        </span>
                        {category.department && (
                          <span className='rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-400'>
                            {category.department}
                          </span>
                        )}
                      </div>
                      <div className='flex items-center gap-2 text-xs text-[#6c757d] dark:text-text-dark-secondary'>
                        <span className='material-symbols-outlined text-sm'>
                          calendar_today
                        </span>
                        Nominations close: {category.nominationDeadline}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
