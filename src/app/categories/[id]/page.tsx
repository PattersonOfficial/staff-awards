'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Avatar from '@/components/ui/Avatar';
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
import { castVote, hasUserVoted } from '@/supabase/services/votes';
import { useAuth } from '@/supabase/hooks/useAuth';
import { useToast } from '@/context/ToastContext';
import { AwardCategory, Staff } from '@/types';
// import { getStaffByEmail } from '@/supabase/services/staff'; // Removed as no longer needed

// Helper to map Supabase Category to AwardCategory
const mapCategory = (cat: SupabaseCategory): AwardCategory => ({
  id: cat?.id,
  title: cat?.title,
  description: cat?.description ?? '',
  image: cat?.image ?? '/assets/images/award-placeholder.jpg', // Fallback image if null
  type: cat?.type,
  department: cat?.department ?? 'All Departments',
  nominationDeadline: cat?.nomination_end ?? cat?.nomination_deadline ?? '',
  status: cat?.status as 'draft' | 'published' | 'closed',
  shortlistingStart: cat?.shortlisting_start,
  shortlistingEnd: cat?.shortlisting_end,
  votingStart: cat?.voting_start,
  votingEnd: cat?.voting_end,
});

// Helper to map Supabase Staff to Staff
const mapStaff = (s: SupabaseStaff): Staff => ({
  id: s?.id,
  name: s?.name,
  email: s?.email,
  position: s?.position ?? '',
  department: s?.department ?? '',
  avatar: s?.avatar || null,
});

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [category, setCategory] = useState<AwardCategory | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Selection
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals & Status
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  // Phase Check
  const [currentPhase, setCurrentPhase] = useState<
    'nomination' | 'voting' | 'closed'
  >('nomination');

  useEffect(() => {
    async function fetchData() {
      const categoryId = params.id as string;
      let fetchedCategory: AwardCategory | null = null;
      let fetchedStaff: Staff[] = [];
      let phase: 'nomination' | 'voting' | 'closed' = 'nomination';

      try {
        // 1. Fetch Category
        try {
          const catData = await getCategoryById(categoryId);
          if (catData) {
            fetchedCategory = mapCategory(catData);
          }
        } catch (err) {
          console.log('Supabase category fetch failed', err);
        }

        setCategory(fetchedCategory);

        // 2. Determine Phase
        if (fetchedCategory) {
          const now = new Date();
          const voteStart = fetchedCategory.votingStart
            ? new Date(fetchedCategory.votingStart)
            : null;
          const voteEnd = fetchedCategory.votingEnd
            ? new Date(fetchedCategory.votingEnd)
            : null;

          if (voteStart && now >= voteStart && (!voteEnd || now <= voteEnd)) {
            phase = 'voting';
          } else if (fetchedCategory.status === 'closed') {
            phase = 'closed';
          } else {
            phase = 'nomination';
          }
          setCurrentPhase(phase);
        }

        // 3. Fetch List based on Phase
        if (phase === 'voting') {
          // Fetch Finalists (nominees marked as is_finalist = true)
          try {
            const { getFinalistsByCategory } = await import(
              '@/supabase/services/nominations'
            );
            const finalistData = await getFinalistsByCategory(categoryId);

            // Map to Staff type
            const finalists = finalistData.map((f) => mapStaff(f.nominee));
            fetchedStaff = finalists;

            // Check if user has voted
            if (user && categoryId) {
              const voted = await hasUserVoted(categoryId, user.id);
              setAlreadyVoted(voted);
            }
          } catch (err) {
            console.error('Error fetching finalists', err);
          }
        } else {
          // Fetch All Staff for Nomination
          try {
            const staffData = await getStaff();
            if (staffData && staffData.length > 0) {
              fetchedStaff = staffData.map(mapStaff);
            }
          } catch (err) {
            console.log('Supabase staff fetch failed', err);
          }
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
  }, [params.id, user]);

  const selectedStaff = staffList.find((s) => s.id === selectedStaffId);

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActionClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (currentPhase === 'voting') {
      // Vote Action
      if (selectedStaffId && !alreadyVoted) {
        handleVoteSubmit();
      }
    } else {
      // Nomination Action
      if (selectedStaffId) {
        setIsFormModalOpen(true);
      }
    }
  };

  const handleVoteSubmit = async () => {
    if (!user || !category || !selectedStaffId) return;
    setSubmitting(true);
    try {
      await castVote({
        voter_id: user.id,
        category_id: category.id,
        nominee_id: selectedStaffId,
      });
      setAlreadyVoted(true);
      setIsSuccessModalOpen(true);
      toast.success('Vote cast successfully!');
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error('Failed to cast vote.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNominationSubmit = async (reason: string) => {
    if (!user || !category || !selectedStaffId) return;

    setSubmitting(true);
    try {
      // Dynamic import or assumed import
      const { createNomination } = await import(
        '@/supabase/services/nominations'
      );

      await createNomination({
        category_id: category.id,
        nominee_id: selectedStaffId,
        nominator_user_id: user.id, // Supabase Auth UUID
        nominator_email: user.email, // For display purposes
        reason: reason,
        status: 'pending',
      });

      setIsFormModalOpen(false);
      setIsSuccessModalOpen(true);
      toast.success('Nomination submitted successfully!');
    } catch (error) {
      console.error('Error nominating:', error);
      toast.error('Failed to nominate. Please try again.');
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

  if (!category) return <div>Category not found</div>;

  return (
    <div className='relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark'>
      <Header />
      <main className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        <div className='flex flex-col gap-8'>
          {/* Breadcrumbs */}
          <div className='flex flex-wrap gap-2'>
            <Link className='text-gray-500 hover:text-primary' href='/'>
              All Categories
            </Link>
            <span className='text-gray-500'>/</span>
            <span className='font-medium text-gray-900 dark:text-white'>
              {category.title}
            </span>
          </div>

          {/* Hero / Info */}
          <div className='flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='flex justify-between items-start'>
              <div>
                <h1 className='text-3xl font-black text-gray-900 dark:text-white mb-2'>
                  {category.title}
                </h1>
                <p className='text-gray-600 dark:text-gray-300'>
                  {category.description}
                </p>
              </div>
              <div
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${
                  currentPhase === 'voting'
                    ? 'bg-purple-100 text-purple-700'
                    : currentPhase === 'closed'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-green-100 text-green-700'
                }`}>
                {currentPhase === 'voting'
                  ? 'Voting Open'
                  : currentPhase === 'closed'
                  ? 'Closed'
                  : 'Nominations Open'}
              </div>
            </div>

            {currentPhase === 'nomination' && category.nominationDeadline && (
              <p className='text-sm text-gray-500'>
                Nominations close:{' '}
                {new Date(category.nominationDeadline).toLocaleDateString()}
              </p>
            )}
            {currentPhase === 'voting' && category.votingEnd && (
              <p className='text-sm text-gray-500'>
                Voting closes:{' '}
                {new Date(category.votingEnd).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Controls */}
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <SearchBar
              placeholder='Search...'
              value={searchQuery}
              onChange={setSearchQuery}
            />

            <div className='flex items-center gap-2'>
              <div className='flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1'>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 pb-0! rounded ${
                    viewMode === 'list'
                      ? 'bg-white shadow text-primary'
                      : 'text-gray-500'
                  }`}>
                  <span className='material-symbols-outlined'>view_list</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 pb-0! rounded ${
                    viewMode === 'grid'
                      ? 'bg-white shadow text-primary'
                      : 'text-gray-500'
                  }`}>
                  <span className='material-symbols-outlined'>grid_view</span>
                </button>
              </div>

              {currentPhase !== 'closed' && (
                <button
                  onClick={handleActionClick}
                  disabled={
                    !selectedStaffId ||
                    submitting ||
                    (currentPhase === 'voting' && alreadyVoted)
                  }
                  className='h-12 cursor-pointer px-6 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all'>
                  {submitting
                    ? 'Processing...'
                    : currentPhase === 'voting'
                    ? alreadyVoted
                      ? 'Voted'
                      : 'Vote For Candidate'
                    : 'Nominate Staff'}
                </button>
              )}
            </div>
          </div>

          {/* Already Voted Message */}
          {currentPhase === 'voting' && alreadyVoted && (
            <div className='bg-blue-50 text-blue-800 p-4 rounded-lg flex items-center gap-2'>
              <span className='material-symbols-outlined'>info</span>
              You have already cast your vote for this category.
            </div>
          )}

          {/* Grid/List */}
          {filteredStaff.length === 0 ? (
            <div className='text-center py-12 text-gray-500'>
              No results found.
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
            // ... existing imports ...

            // ... inside component ...
            <div className='flex flex-col gap-3'>
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  onClick={() => setSelectedStaffId(staff.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                    selectedStaffId === staff.id
                      ? 'border-primary bg-primary/5 dark:bg-primary/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 dark:hover:border-primary/50'
                  }`}>
                  <Avatar
                    src={staff.avatar}
                    name={staff.name}
                    className='w-12 h-12'
                    textClassName='text-lg'
                  />
                  <div>
                    <h4 className='font-bold text-gray-900 dark:text-white'>
                      {staff.name}
                    </h4>
                    <p className='text-sm text-gray-500'>{staff.position}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <NominationFormModal
        isOpen={isFormModalOpen}
        staff={selectedStaff || null}
        category={category}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleNominationSubmit}
      />

      <NominationSuccessModal
        isOpen={isSuccessModalOpen}
        staff={selectedStaff || null}
        category={category}
        onClose={handleSuccessClose}
        title={
          currentPhase === 'voting' ? 'Vote Submitted' : 'Nomination Submitted'
        }
        message={
          currentPhase === 'voting'
            ? `You have successfully voted for ${selectedStaff?.name}.`
            : undefined
        }
      />
    </div>
  );
}
