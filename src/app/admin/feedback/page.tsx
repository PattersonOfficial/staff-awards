'use client';

import { useEffect, useState } from 'react';
import {
  getAllFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  Feedback,
} from '@/supabase/services/feedback';
import { useToast } from '@/context/ToastContext';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

type FilterStatus = 'all' | 'new' | 'reviewed' | 'resolved';

export default function AdminFeedbackPage() {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<{
    feedbackId: string;
    status: 'new' | 'reviewed' | 'resolved';
  } | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const data = await getAllFeedback();
      setFeedback(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) return;

    try {
      await updateFeedbackStatus(
        pendingStatus.feedbackId,
        pendingStatus.status
      );
      setFeedback((prev) =>
        prev.map((f) =>
          f.id === pendingStatus.feedbackId
            ? { ...f, status: pendingStatus.status }
            : f
        )
      );
      if (selectedFeedback?.id === pendingStatus.feedbackId) {
        setSelectedFeedback((prev) =>
          prev ? { ...prev, status: pendingStatus.status } : null
        );
      }
      toast.success(`Status updated to ${pendingStatus.status}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsStatusModalOpen(false);
      setPendingStatus(null);
    }
  };

  const handleStatusClick = (
    feedbackId: string,
    status: 'new' | 'reviewed' | 'resolved'
  ) => {
    setPendingStatus({ feedbackId, status });
    setIsStatusModalOpen(true);
  };

  const handleDelete = async () => {
    if (!feedbackToDelete) return;

    try {
      await deleteFeedback(feedbackToDelete);
      setFeedback((prev) => prev.filter((f) => f.id !== feedbackToDelete));
      toast.success('Feedback deleted');
      if (selectedFeedback?.id === feedbackToDelete) {
        setSelectedFeedback(null);
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback');
    } finally {
      setIsDeleteModalOpen(false);
      setFeedbackToDelete(null);
    }
  };

  const filteredFeedback =
    filter === 'all' ? feedback : feedback.filter((f) => f.status === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return 'bug_report';
      case 'feature':
        return 'lightbulb';
      case 'improvement':
        return 'trending_up';
      default:
        return 'chat';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'feature':
        return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'improvement':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusCounts = {
    all: feedback.length,
    new: feedback.filter((f) => f.status === 'new').length,
    reviewed: feedback.filter((f) => f.status === 'reviewed').length,
    resolved: feedback.filter((f) => f.status === 'resolved').length,
  };

  return (
    <main className='flex-1 p-6 lg:p-10'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='flex flex-col gap-2 mb-8'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
            User Feedback
          </h1>
          <p className='text-gray-500 dark:text-gray-400'>
            Review and manage feedback from staff members.
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          {[
            {
              key: 'all',
              label: 'Total',
              icon: 'inbox',
              color: 'text-gray-600',
            },
            {
              key: 'new',
              label: 'New',
              icon: 'fiber_new',
              color: 'text-yellow-500',
            },
            {
              key: 'reviewed',
              label: 'Reviewed',
              icon: 'visibility',
              color: 'text-blue-500',
            },
            {
              key: 'resolved',
              label: 'Resolved',
              icon: 'check_circle',
              color: 'text-green-500',
            },
          ].map((stat) => (
            <button
              key={stat.key}
              onClick={() => setFilter(stat.key as FilterStatus)}
              className={`p-4 rounded-xl border transition-all ${
                filter === stat.key
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
              }`}>
              <div className='flex items-center gap-3'>
                <span className={`material-symbols-outlined ${stat.color}`}>
                  {stat.icon}
                </span>
                <div className='text-left'>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {statusCounts[stat.key as keyof typeof statusCounts]}
                  </p>
                  <p className='text-xs text-gray-500'>{stat.label}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Feedback List */}
          <div className='lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden'>
            {loading ? (
              <div className='flex p-12 items-center justify-center min-h-[300px]'>
                <div className='h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent' />
              </div>
            ) : filteredFeedback.length === 0 ? (
              <div className='p-12 text-center text-gray-500'>
                <span className='material-symbols-outlined text-4xl mb-2'>
                  feedback
                </span>
                <p>No feedback found.</p>
              </div>
            ) : (
              <div className='divide-y divide-gray-200 dark:divide-gray-700'>
                {filteredFeedback.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedFeedback(item)}
                    className={`w-full p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      selectedFeedback?.id === item.id
                        ? 'bg-primary/5 border-l-4 border-l-primary'
                        : ''
                    }`}>
                    <div className='flex items-start gap-3'>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(
                          item.type
                        )}`}>
                        <span className='material-symbols-outlined text-lg'>
                          {getTypeIcon(item.type)}
                        </span>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='font-medium text-gray-900 dark:text-white truncate'>
                            {item.user_name || item.user_email}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                              item.status
                            )}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
                          {item.message}
                        </p>
                        <p className='text-xs text-gray-400 mt-1'>
                          {new Date(item.created_at).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden'>
            {selectedFeedback ? (
              <div className='flex flex-col h-full'>
                <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                  <div className='flex items-center justify-between mb-3'>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getTypeColor(
                        selectedFeedback.type
                      )}`}>
                      {selectedFeedback.type}
                    </div>
                    <button
                      onClick={() => {
                        setFeedbackToDelete(selectedFeedback.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className='p-2 text-gray-400 hover:text-red-500 transition-colors'>
                      <span className='material-symbols-outlined'>delete</span>
                    </button>
                  </div>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>
                    {selectedFeedback.user_name || 'Anonymous User'}
                  </h3>
                  <p className='text-sm text-gray-500'>
                    {selectedFeedback.user_email}
                  </p>
                  <p className='text-xs text-gray-400 mt-1'>
                    {new Date(selectedFeedback.created_at).toLocaleString()}
                  </p>
                </div>
                <div className='p-4 flex-1'>
                  <p className='text-gray-700 dark:text-gray-300 whitespace-pre-wrap'>
                    {selectedFeedback.message}
                  </p>
                </div>
                <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Update Status
                  </label>
                  <div className='flex gap-2'>
                    {(['new', 'reviewed', 'resolved'] as const).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() =>
                            handleStatusClick(selectedFeedback.id, status)
                          }
                          className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold capitalize cursor-pointer transition-all ${
                            selectedFeedback.status === status
                              ? status === 'new'
                                ? 'bg-yellow-500 text-white shadow-md'
                                : status === 'reviewed'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-green-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                          }`}>
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className='p-12 text-center text-gray-500'>
                <span className='material-symbols-outlined text-4xl mb-2'>
                  touch_app
                </span>
                <p>Select feedback to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title='Delete Feedback'
        message='Are you sure you want to delete this feedback? This action cannot be undone.'
        confirmText='Delete'
        isDangerous={true}
      />

      <ConfirmationModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setPendingStatus(null);
        }}
        onConfirm={confirmStatusChange}
        title='Update Status'
        message={`Are you sure you want to mark this feedback as "${pendingStatus?.status}"?`}
        confirmText={`Mark as ${pendingStatus?.status}`}
        isDangerous={false}
      />
    </main>
  );
}
