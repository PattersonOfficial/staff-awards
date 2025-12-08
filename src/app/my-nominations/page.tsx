'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import NominationDetailModal from '@/components/ui/NominationDetailModal';
import CancelNominationModal from '@/components/ui/CancelNominationModal';
import Toast from '@/components/ui/Toast';
import { mockNominations } from '@/data/mockData';
import { Nomination } from '@/types';

export default function MyNominationsPage() {
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [nominations, setNominations] = useState(mockNominations);
  const [selectedNomination, setSelectedNomination] =
    useState<Nomination | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [nominationToCancel, setNominationToCancel] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filteredNominations =
    filter === 'all'
      ? nominations
      : nominations.filter((n) => n.status === filter);

  const handleViewNomination = (nomination: Nomination) => {
    setSelectedNomination(nomination);
    setIsDetailModalOpen(true);
  };

  const handleCancelClick = (nominationId: string, nomineeName: string) => {
    setNominationToCancel({ id: nominationId, name: nomineeName });
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = (nominationId: string) => {
    const canceledNomination = nominations.find((n) => n.id === nominationId);
    setNominations((prev) => prev.filter((n) => n.id !== nominationId));
    setIsCancelModalOpen(false);
    setNominationToCancel(null);
    setToastMessage(
      `Nomination for ${canceledNomination?.nominee.name} has been canceled`
    );
    setShowToast(true);
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
                Pending (
                {nominations.filter((n) => n.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === 'approved'
                    ? 'bg-[#0A4D68] text-white'
                    : 'bg-white dark:bg-gray-800 text-[#6c757d] dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}>
                Approved (
                {nominations.filter((n) => n.status === 'approved').length})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === 'rejected'
                    ? 'bg-[#0A4D68] text-white'
                    : 'bg-white dark:bg-gray-800 text-[#6c757d] dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}>
                Rejected (
                {nominations.filter((n) => n.status === 'rejected').length})
              </button>
            </div>

            <div className='flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700'>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#0A4D68] text-white'
                    : 'text-[#6c757d] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title='List view'>
                <span className='material-symbols-outlined'>view_list</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
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
            <div className='text-center py-16'>
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4'>
                <span className='material-symbols-outlined text-4xl text-gray-400'>
                  inbox
                </span>
              </div>
              <h3 className='text-xl font-semibold text-[#212529] dark:text-text-dark-primary mb-2'>
                No nominations found
              </h3>
              <p className='text-[#6c757d] dark:text-text-dark-secondary'>
                You haven't submitted any nominations yet. Start nominating your
                colleagues!
              </p>
            </div>
          ) : viewMode === 'list' ? (
            <div className='grid grid-cols-1 gap-6'>
              {filteredNominations.map((nomination) => (
                <div
                  key={nomination.id}
                  className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden'>
                  <div className='p-6'>
                    <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                      <div className='flex items-start gap-4 flex-1'>
                        <div
                          className='w-16 h-16 rounded-full bg-cover bg-center shrink-0'
                          style={{
                            backgroundImage: `url(${nomination.nominee.avatar})`,
                          }}
                        />
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-1'>
                            <h3 className='text-lg font-bold text-[#212529] dark:text-white'>
                              {nomination.nominee.name}
                            </h3>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(
                                nomination.status
                              )}`}>
                              {nomination.status.charAt(0).toUpperCase() +
                                nomination.status.slice(1)}
                            </span>
                          </div>
                          <p className='text-sm text-[#6c757d] dark:text-gray-400 mb-1'>
                            {nomination.nominee.position} •{' '}
                            {nomination.nominee.department}
                          </p>
                          <div className='flex items-center gap-4 text-xs text-[#6c757d] dark:text-gray-400 mb-3'>
                            <span className='flex items-center gap-1'>
                              <span className='material-symbols-outlined text-sm'>
                                workspace_premium
                              </span>
                              {nomination.category.title}
                            </span>
                            <span className='flex items-center gap-1'>
                              <span className='material-symbols-outlined text-sm'>
                                calendar_today
                              </span>
                              {new Date(
                                nomination.submittedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className='bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mt-3'>
                            <p className='text-xs font-semibold text-[#212529] dark:text-white mb-1'>
                              Reason for Nomination:
                            </p>
                            <p className='text-sm text-[#6c757d] dark:text-gray-400'>
                              {nomination.reason}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='flex md:flex-col gap-2'>
                        <button
                          onClick={() => handleViewNomination(nomination)}
                          className='flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-[#6c757d] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors'>
                          <span className='material-symbols-outlined text-sm'>
                            visibility
                          </span>
                          <span className='hidden sm:inline'>View</span>
                        </button>
                        {nomination.status === 'pending' && (
                          <button
                            onClick={() =>
                              handleCancelClick(
                                nomination.id,
                                nomination.nominee.name
                              )
                            }
                            className='flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors'>
                            <span className='material-symbols-outlined text-sm'>
                              delete
                            </span>
                            <span className='hidden sm:inline'>Cancel</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {filteredNominations.map((nomination) => (
                <div
                  key={nomination.id}
                  className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col'>
                  <div className='p-6 flex flex-col items-center text-center flex-1'>
                    <div
                      className='w-24 h-24 rounded-full bg-cover bg-center mb-4'
                      style={{
                        backgroundImage: `url(${nomination.nominee.avatar})`,
                      }}
                    />
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold mb-2 ${getStatusColor(
                        nomination.status
                      )}`}>
                      {nomination.status.charAt(0).toUpperCase() +
                        nomination.status.slice(1)}
                    </span>
                    <h3 className='text-lg font-bold text-[#212529] dark:text-white mb-1'>
                      {nomination.nominee.name}
                    </h3>
                    <p className='text-sm text-[#6c757d] dark:text-gray-400 mb-1'>
                      {nomination.nominee.position}
                    </p>
                    <p className='text-xs text-[#6c757d] dark:text-gray-500 mb-3'>
                      {nomination.nominee.department}
                    </p>
                    <div className='flex flex-col gap-1 text-xs text-[#6c757d] dark:text-gray-400 mb-4 w-full'>
                      <span className='flex items-center justify-center gap-1'>
                        <span className='material-symbols-outlined text-sm'>
                          workspace_premium
                        </span>
                        {nomination.category.title}
                      </span>
                      <span className='flex items-center justify-center gap-1'>
                        <span className='material-symbols-outlined text-sm'>
                          calendar_today
                        </span>
                        {new Date(nomination.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className='border-t border-gray-200 dark:border-gray-700 p-4 flex gap-2'>
                    <button
                      onClick={() => handleViewNomination(nomination)}
                      className='flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-[#6c757d] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors'>
                      <span className='material-symbols-outlined text-sm'>
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
                        className='flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors'>
                        <span className='material-symbols-outlined text-sm'>
                          delete
                        </span>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredNominations.length > 0 && (
            <div className='mt-8 flex items-center justify-center'>
              <nav className='flex items-center gap-2'>
                <button className='flex items-center justify-center size-10 rounded-lg hover:bg-white dark:hover:bg-gray-800 text-[#6c757d] dark:text-gray-400 transition-colors border border-gray-200 dark:border-gray-700'>
                  <span className='material-symbols-outlined'>
                    chevron_left
                  </span>
                </button>
                <button className='flex items-center justify-center size-10 rounded-lg bg-[#0A4D68] text-white font-bold'>
                  1
                </button>
                <button className='flex items-center justify-center size-10 rounded-lg hover:bg-white dark:hover:bg-gray-800 text-[#6c757d] dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-700'>
                  2
                </button>
                <button className='flex items-center justify-center size-10 rounded-lg hover:bg-white dark:hover:bg-gray-800 text-[#6c757d] dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-700'>
                  3
                </button>
                <button className='flex items-center justify-center size-10 rounded-lg hover:bg-white dark:hover:bg-gray-800 text-[#6c757d] dark:text-gray-400 transition-colors border border-gray-200 dark:border-gray-700'>
                  <span className='material-symbols-outlined'>
                    chevron_right
                  </span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>

      <NominationDetailModal
        nomination={selectedNomination}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedNomination(null);
        }}
      />

      <CancelNominationModal
        isOpen={isCancelModalOpen}
        nominationId={nominationToCancel?.id || ''}
        nomineeName={nominationToCancel?.name || ''}
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setIsCancelModalOpen(false);
          setNominationToCancel(null);
        }}
      />

      <Toast
        message={toastMessage}
        type='success'
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
