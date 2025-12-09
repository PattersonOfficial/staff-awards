'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import StaffCard from '@/components/ui/StaffCard';
import SearchBar from '@/components/ui/SearchBar';
import NominationFormModal from '@/components/ui/NominationFormModal';
import NominationSuccessModal from '@/components/ui/NominationSuccessModal';
import { getCategoryById, Category } from '@/supabase/services/categories';
import { getStaff, StaffMember } from '@/supabase/services/staff';
import { castVote } from '@/supabase/services/votes';
import { useAuth } from '@/supabase/hooks/useAuth';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [category, setCategory] = useState<Category | null>(null);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catData, staffData] = await Promise.all([
          getCategoryById(params.id as string),
          getStaff()
        ]);
        setCategory(catData);
        setStaffList(staffData);
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
      await castVote({
        voter_id: user.id,
        category_id: category.id,
        nominee_id: selectedStaffId,
      });
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
        <p className='text-text-light-primary dark:text-text-dark-primary'>Category not found</p>
      </div>
    );
  }

  // Helper to map StaffMember to the interface expected by StaffCard (if different)
  // StaffMember has same fields as Staff interface: id, name, position, department, avatar (nullable vs string)
  // We need to handle null avatar
  const mapStaffToCard = (staff: StaffMember) => ({
    ...staff,
    avatar: staff.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(staff.name)
  });

  return (
    <div className='relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark'>
      <Header />
      <main className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-wrap gap-2'>
            <a
              className='text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-white text-base font-medium leading-normal'
              href='/'>
              All Categories
            </a>
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
                Nominations close: {new Date(category.nomination_deadline).toLocaleDateString()}
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
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'text-white bg-primary'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'
                  }`}>
                  <span className='material-symbols-outlined'>view_list</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
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
                <span className='truncate'>{submitting ? 'Submitting...' : 'Nominate Staff'}</span>
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
                  staff={mapStaffToCard(staff)}
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
                    style={{ backgroundImage: `url(${staff.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(staff.name)})` }}
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
        staff={selectedStaff ? mapStaffToCard(selectedStaff) : null}
        category={category ? { ...category, nominationDeadline: category.nomination_deadline } : null}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleNominationSubmit}
      />

      <NominationSuccessModal
        isOpen={isSuccessModalOpen}
        staff={selectedStaff ? mapStaffToCard(selectedStaff) : null}
        category={category ? { ...category, nominationDeadline: category.nomination_deadline } : null}
        onClose={handleSuccessClose}
      />
    </div>
  );
}
