'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import StaffCard from '@/components/ui/StaffCard';
import SearchBar from '@/components/ui/SearchBar';
import NominationFormModal from '@/components/ui/NominationFormModal';
import NominationSuccessModal from '@/components/ui/NominationSuccessModal';
import {
  getCategoryById,
  Category as SupabaseCategory,
} from '@/supabase/services/categories';
import {
  getStaff,
  StaffMember as SupabaseStaff,
} from '@/supabase/services/staff';
import { castVote } from '@/supabase/services/votes';
import { useAuth } from '@/supabase/hooks/useAuth';
import { mockCategories, mockStaff } from '@/data/mockData';
import { AwardCategory, Staff } from '@/types';

// Helper to map Supabase Category to AwardCategory
const mapCategory = (cat: SupabaseCategory): AwardCategory => ({
  id: cat.id,
  title: cat.title,
  description: cat.description,
  image: cat.image,
  type: cat.type as 'Individual Award' | 'Team Award',
  department: cat.department,
  nominationDeadline: cat.nomination_deadline, // Map snake_case to camelCase
  status: cat.status as 'draft' | 'published' | 'closed',
  shortlistingStart: cat.shortlisting_start,
  shortlistingEnd: cat.shortlisting_end,
  votingStart: cat.voting_start,
  votingEnd: cat.voting_end,
});

// Helper to map Supabase Staff to Staff (mostly compatible, but good to be explicit)
const mapStaff = (s: SupabaseStaff): Staff => ({
  id: s.id,
  name: s.name,
  email: s.email,
  position: s.position,
  department: s.department,
  avatar:
    s.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}`,
});

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [category, setCategory] = useState<AwardCategory | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const categoryId = params.id as string;
      let fetchedCategory: AwardCategory | null = null;
      let fetchedStaff: Staff[] = [];

      try {
        // 1. Try fetching Category from Supabase
        try {
          // Basic check if it's a valid UUID (simple regex or let Supabase fail)
          // If it's a short integer ID (like '1', '2'), getCategoryById might fail or return nothing if column type matches but value doesn't.
          // However, if the column is UUID, sending '1' will throw an error.
          const catData = await getCategoryById(categoryId);
          if (catData) {
            fetchedCategory = mapCategory(catData);
          }
        } catch (err) {
          console.log(
            'Supabase category fetch failed, falling back to mock data',
            err
          );
        }

        // 2. Fallback to Mock Data if not found in Supabase
        if (!fetchedCategory) {
          const mockCat = mockCategories.find((c) => c.id === categoryId);
          if (mockCat) {
            fetchedCategory = mockCat;
          }
        }

        setCategory(fetchedCategory);

        // 3. Fetch Staff
        try {
          const staffData = await getStaff();
          if (staffData && staffData.length > 0) {
            fetchedStaff = staffData.map(mapStaff);
          }
        } catch (err) {
          console.log(
            'Supabase staff fetch failed, falling back to mock data',
            err
          );
        }

        // 4. Fallback/Supplement with Mock Staff if Supabase is empty or failed
        // For this demo, let's prefer Supabase if available, otherwise mock.
        if (fetchedStaff.length === 0) {
          fetchedStaff = mockStaff;
        }

        setStaffList(fetchedStaff);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const selectedStaff = staffList.find((s) => s.id === selectedStaffId);

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNominateClick = () => {
    if (!user) {
      // If using mock data/no auth setup fully, we might want to allow nomination or prompt login.
      // For now, mirroring original behavior.
      router.push('/login');
      return;
    }
    if (selectedStaffId) {
      setIsFormModalOpen(true);
    }
  };

  const handleNominationSubmit = async (reason: string) => {
    if (!user || !category || !selectedStaffId) return;

    try {
      setSubmitting(true);
      // We are using castVote which uses upsert to allow replacing votes.
      // Note: The 'reason' is currently not stored in the votes table as it doesn't have a column for it.

      // We only try to save to DB if it looks like a real DB category (UUID)
      // If it's mock data (simple ID '1'), we just pretend success.
      const isMockCategory = category.id.length < 10; // Simple heuristic for now

      if (!isMockCategory) {
        await castVote({
          voter_id: user.id,
          category_id: category.id,
          nominee_id: selectedStaffId,
        });
      } else {
        // Simulate API delay for mock
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Mock vote cast:', {
          voter: user.id,
          category: category.id,
          nominee: selectedStaffId,
          reason,
        });
      }

      setIsFormModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
    setSelectedStaffId(null);
  };

  if (loading || authLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-text-light-primary dark:text-text-dark-primary mb-2'>
            Category Not Found
          </h2>
          <button
            onClick={() => router.push('/')}
            className='text-primary hover:underline'>
            Return to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark'>
      <Header />
      <main className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-wrap gap-2'>
            <Link
              className='text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-white text-base font-medium leading-normal'
              href='/'>
              All Categories
            </Link>
            <span className='text-text-light-secondary dark:text-text-dark-secondary text-base font-medium leading-normal'>
              /
            </span>
            <span className='text-text-light-primary dark:text-text-dark-primary text-base font-medium leading-normal'>
              {category.title}
            </span>
          </div>

          <div className='flex flex-col gap-4 bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700'>
            <h1 className='text-text-light-primary dark:text-text-dark-primary text-4xl font-black leading-tight tracking-[-0.033em]'>
              {category.title}
            </h1>
            <p className='text-text-light-secondary dark:text-text-dark-secondary text-base font-normal leading-normal'>
              {category.description}
            </p>
            <div className='flex items-center gap-2 mt-2'>
              <span className='material-symbols-outlined text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                calendar_today
              </span>
              <p className='text-text-light-secondary dark:text-text-dark-secondary text-sm'>
                Nominations close:{' '}
                {/* Check if it's a valid date string or needs parsing */}
                {/* Mock data might use "25 Dec", DB uses ISO. Display as is if simple string, or format if ISO. */}
                {category.nominationDeadline}
              </p>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <SearchBar
              placeholder='Search by name or department...'
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <div className='flex items-center gap-2'>
              <div className='flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-1'>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 pb-0! rounded-md transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'text-white bg-primary'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'
                  }`}>
                  <span className='material-symbols-outlined'>view_list</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 pb-0! rounded-md transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'text-white bg-primary'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'
                  }`}>
                  <span className='material-symbols-outlined'>grid_view</span>
                </button>
              </div>
              <button
                onClick={handleNominateClick}
                className='flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed'
                disabled={!selectedStaffId || submitting}>
                <span className='truncate'>
                  {submitting ? 'Submitting...' : 'Nominate Staff'}
                </span>
              </button>
            </div>
          </div>

          {filteredStaff.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-text-light-secondary dark:text-text-dark-secondary'>
                No staff members found matching your search.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {filteredStaff.map((staff) => (
                <StaffCard
                  key={staff.id}
                  staff={staff}
                  selected={selectedStaffId === staff.id}
                  onClick={() => setSelectedStaffId(staff.id)}
                />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-3'>
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className={`flex items-center gap-4 p-4 rounded-xl shadow-sm cursor-pointer transition-all duration-200 ${
                    selectedStaffId === staff.id
                      ? 'bg-white dark:bg-slate-800 border-2 border-primary ring-2 ring-primary/20 dark:ring-primary/30'
                      : 'bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary'
                  }`}
                  onClick={() => setSelectedStaffId(staff.id)}>
                  <div
                    className='bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16 shrink-0'
                    style={{
                      backgroundImage: `url(${staff.avatar})`,
                    }}
                  />
                  <div className='flex-1 min-w-0'>
                    <h4 className='text-slate-900 dark:text-slate-100 text-base font-bold leading-tight'>
                      {staff.name}
                    </h4>
                    <p className='text-slate-600 dark:text-slate-400 text-sm font-normal'>
                      {staff.position}
                    </p>
                    <p className='text-slate-500 dark:text-slate-500 text-xs font-normal mt-0.5'>
                      {staff.department}
                    </p>
                  </div>
                  {selectedStaffId === staff.id && (
                    <div className='shrink-0'>
                      <span className='material-symbols-outlined text-primary text-2xl'>
                        check_circle
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <NominationFormModal
        isOpen={isFormModalOpen}
        staff={selectedStaff ? selectedStaff : null}
        category={category}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleNominationSubmit}
      />

      <NominationSuccessModal
        isOpen={isSuccessModalOpen}
        staff={selectedStaff ? selectedStaff : null}
        category={category}
        onClose={handleSuccessClose}
      />
    </div>
  );
}
