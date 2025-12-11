'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/supabase/hooks/useAuth';
import Header from '@/components/layout/Header';
import NominationDetailModal from '@/components/ui/NominationDetailModal';
import CancelNominationModal from '@/components/ui/CancelNominationModal';
import Avatar from '@/components/ui/Avatar';
import Toast from '@/components/ui/Toast';
import {
  getNominationsByUserUid,
  deleteNomination,
} from '@/supabase/services/nominations';

// Map Supabase NominationWithDetails to strict UI Nomination type if needed, but let's try to align types.
// The UI components expect a specific shape. Let's look at `src/types/index.ts` or similar if it exists.
// Or just use `NominationWithDetails` and adapt UI if needed.
// For now, I'll adapt the fetched data to the shape expected by the UI render.
// The UI render expects: { id, status, submittedAt, nominee: { name, avatar, position }, category: { title } }

// Helper type for UI
type UINomination = {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'shortlisted';
  submittedAt: string;
  nominee: {
    name: string;
    avatar: string;
    position: string;
  };
  category: {
    title: string;
  };
  reason?: string; // For modal
};

export default function MyNominationsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [filter, setFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [nominations, setNominations] = useState<UINomination[]>([]);
  const [selectedNomination, setSelectedNomination] =
    useState<UINomination | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [nominationToCancel, setNominationToCancel] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchUserNominations() {
      if (!user?.id) return;

      try {
        setLoadingData(true);

        // Get nominations by Auth User UUID (primary and only method now)
        const data = await getNominationsByUserUid(user.id);

        // Map to UI
        const mapped: UINomination[] = data.map((n) => ({
          id: n.id,
          status: n.status as UINomination['status'],
          submittedAt: n.created_at,
          nominee: {
            name: n.nominee.name,
            avatar:
              n.nominee.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                n.nominee.name
              )}`,
            position: n.nominee.position || 'Unknown',
          },
          category: {
            title: n.category.title,
          },
          reason: n.reason || '',
        }));

        // Sort by most recent first
        const sorted = mapped.sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime()
        );

        setNominations(sorted);
      } catch (err) {
        console.error('Error fetching nominations:', err);
      } finally {
        setLoadingData(false);
      }
    }

    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchUserNominations();
      }
    }
  }, [user, loading, router]);

  if (loading || loadingData) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-[#F8F9FA] dark:bg-background-dark'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const filteredNominations =
    filter === 'all'
      ? nominations
      : nominations.filter((n) => n.status === filter);

  const handleViewNomination = (nomination: UINomination) => {
    setSelectedNomination(nomination);
    setIsDetailModalOpen(true);
  };

  const handleCancelClick = (nominationId: string, nomineeName: string) => {
    setNominationToCancel({ id: nominationId, name: nomineeName });
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async (nominationId: string) => {
    try {
      await deleteNomination(nominationId);
      const canceledNomination = nominations.find((n) => n.id === nominationId);
      setNominations((prev) => prev.filter((n) => n.id !== nominationId));
      setIsCancelModalOpen(false);
      setNominationToCancel(null);
      setToastMessage(
        `Nomination for ${canceledNomination?.nominee.name} has been canceled`
      );
      setShowToast(true);
    } catch (error) {
      console.error('Error canceling nomination:', error);
      setToastMessage('Failed to cancel nomination. Please try again.');
      setShowToast(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300';
      case 'shortlisted':
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className='relative flex min-h-screen w-full flex-col bg-[#F8F9FA] dark:bg-background-dark'>
      <Header />
      <main className='flex w-full flex-1 flex-col items-center px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
        <div className='w-full max-w-7xl'>
          <div className='mb-8'>
            <h1 className='text-4xl font-black tracking-tighter text-[#212529] dark:text-text-dark-primary'>
              My Nominations
            </h1>
            <p className='mt-2 text-lg text-[#6c757d] dark:text-text-dark-secondary'>
              View and track all your submitted nominations
            </p>
          </div>

          <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
            <div className='flex flex-wrap gap-3'>
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === 'all'
                    ? 'bg-[#0A4D68] text-white'
                    : 'bg-white dark:bg-gray-800 text-[#6c757d] dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}>
                All ({nominations.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === 'pending'
                    ? 'bg-[#0A4D68] text-white'
                    : 'bg-white dark:bg-gray-800 text-[#6c757d] dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}>
                Pending
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === 'approved'
                    ? 'bg-[#0A4D68] text-white'
                    : 'bg-white dark:bg-gray-800 text-[#6c757d] dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}>
                Approved
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === 'rejected'
                    ? 'bg-[#0A4D68] text-white'
                    : 'bg-white dark:bg-gray-800 text-[#6c757d] dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}>
                Rejected
              </button>
            </div>
            <div className='flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700'>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2  pb-0! rounded-md transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#0A4D68] text-white'
                    : 'text-[#6c757d] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title='List view'>
                <span className='material-symbols-outlined'>view_list</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#0A4D68] text-white'
                    : 'text-[#6c757d] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title='Grid view'>
                <span className='material-symbols-outlined'>grid_view</span>
              </button>
            </div>
          </div>

          {filteredNominations.length === 0 ? (
            <div className='flex flex-col items-center justify-center rounded-xl bg-white dark:bg-card-dark p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'>
                <span className='material-symbols-outlined text-3xl'>
                  inbox
                </span>
              </div>
              <h3 className='text-lg font-bold text-text-light-primary dark:text-text-dark-primary'>
                No nominations found
              </h3>
              <p className='mt-1 text-text-light-secondary dark:text-text-dark-secondary'>
                {filter === 'all'
                  ? "You haven't submitted any nominations yet."
                  : `You don't have any ${filter} nominations.`}
              </p>
            </div>
          ) : viewMode === 'list' ? (
            <div className='flex flex-col gap-4'>
              {filteredNominations.map((nomination) => (
                <div
                  key={nomination.id}
                  className='group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark p-4 shadow-sm transition-all hover:shadow-md'>
                  <div className='flex items-center gap-4'>
                    <Avatar
                      src={nomination.nominee.avatar}
                      name={nomination.nominee.name}
                      className='h-12 w-12'
                    />
                    <div>
                      <h3 className='font-bold text-text-light-primary dark:text-text-dark-primary'>
                        {nomination.nominee.name}
                      </h3>
                      <p className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                        {nomination.category.title}
                      </p>
                    </div>
                  </div>
                  <div className='flex w-full md:w-auto items-center justify-between gap-4 md:justify-end'>
                    <div className='flex items-center gap-4'>
                      <span className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                        Submitted{' '}
                        {new Date(nomination.submittedAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          nomination.status
                        )}`}>
                        {nomination.status.charAt(0).toUpperCase() +
                          nomination.status.slice(1)}
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <button
                        onClick={() => handleViewNomination(nomination)}
                        className='flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                        title='View details'>
                        <span className='material-symbols-outlined text-xl'>
                          visibility
                        </span>
                      </button>
                      {nomination.status === 'pending' && (
                        <button
                          onClick={() =>
                            handleCancelClick(
                              nomination.id,
                              nomination.nominee.name
                            )
                          }
                          className='flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors'
                          title='Cancel nomination'>
                          <span className='material-symbols-outlined text-xl'>
                            close
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {filteredNominations.map((nomination) => (
                <div
                  key={nomination.id}
                  className='group flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark shadow-sm transition-all hover:shadow-md'>
                  <div className='flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 p-4'>
                    <Avatar
                      src={nomination.nominee.avatar}
                      name={nomination.nominee.name}
                      className='h-10 w-10'
                    />
                    <div className='overflow-hidden'>
                      <h3 className='truncate font-bold text-text-light-primary dark:text-text-dark-primary'>
                        {nomination.nominee.name}
                      </h3>
                      <p className='truncate text-xs text-text-light-secondary dark:text-text-dark-secondary'>
                        {nomination.nominee.position}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-1 flex-col p-4'>
                    <div className='mb-4'>
                      <span className='text-xs font-medium text-text-light-secondary dark:text-text-dark-secondary uppercase tracking-wider'>
                        Category
                      </span>
                      <p className='font-medium text-primary'>
                        {nomination.category.title}
                      </p>
                    </div>
                    <div className='mt-auto flex items-center justify-between'>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          nomination.status
                        )}`}>
                        {nomination.status.charAt(0).toUpperCase() +
                          nomination.status.slice(1)}
                      </span>
                      <span className='text-xs text-text-light-secondary dark:text-text-dark-secondary'>
                        {new Date(nomination.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3'>
                    <button
                      onClick={() => handleViewNomination(nomination)}
                      className='flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-2 text-sm font-medium text-text-light-primary dark:text-text-dark-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                      <span className='material-symbols-outlined text-lg'>
                        visibility
                      </span>
                      View
                    </button>
                    {nomination.status === 'pending' && (
                      <button
                        onClick={() =>
                          handleCancelClick(
                            nomination.id,
                            nomination.nominee.name
                          )
                        }
                        className='flex items-center cursor-pointer justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors'
                        title='Cancel'>
                        <span className='material-symbols-outlined text-lg'>
                          close
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <NominationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        nomination={selectedNomination as any} // Cast safely due to structure match
      />

      <CancelNominationModal
        isOpen={isCancelModalOpen}
        nominationId={nominationToCancel?.id || ''}
        nomineeName={nominationToCancel?.name || ''}
        onCancel={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />

      <Toast
        isVisible={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
