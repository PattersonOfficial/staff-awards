'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getCategoryById } from '@/supabase/services/categories';
import {
  getNomineesForCategoryWithCounts,
  markAsFinalists,
  NomineeWithCount,
} from '@/supabase/services/nominations';
import Avatar from '@/components/ui/Avatar';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useToast } from '@/context/ToastContext';

const MAX_FINALISTS = 5;

export default function CategoryShortlistPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const { toast } = useToast();

  const [category, setCategory] = useState<{ title: string } | null>(null);
  const [nominees, setNominees] = useState<NomineeWithCount[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [nomineeToRemove, setNomineeToRemove] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catData, nomineesData] = await Promise.all([
          getCategoryById(categoryId),
          getNomineesForCategoryWithCounts(categoryId),
        ]);
        setCategory(catData);
        setNominees(nomineesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load category data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [categoryId, toast]);

  const currentFinalists = nominees.filter((n) => n.is_finalist);
  const canAddMore = currentFinalists.length < MAX_FINALISTS;
  const selectedCount = selectedIds.size;

  const handleSelect = (nomineeId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(nomineeId)) {
      newSelected.delete(nomineeId);
    } else {
      // Check if we'd exceed max finalists
      const totalAfterAdd = currentFinalists.length + newSelected.size + 1;
      if (totalAfterAdd > MAX_FINALISTS) {
        toast.error(`Maximum ${MAX_FINALISTS} finalists allowed per category`);
        return;
      }
      newSelected.add(nomineeId);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    const nonFinalists = nominees.filter((n) => !n.is_finalist);
    const availableSlots = MAX_FINALISTS - currentFinalists.length;

    if (selectedIds.size === nonFinalists.length) {
      // Deselect all
      setSelectedIds(new Set());
    } else {
      // Select up to available slots
      const toSelect = nonFinalists.slice(0, availableSlots);
      setSelectedIds(new Set(toSelect.map((n) => n.nominee_id)));
    }
  };

  const handleConfirmFinalists = async () => {
    if (selectedIds.size === 0) return;

    setSaving(true);
    try {
      await markAsFinalists(categoryId, Array.from(selectedIds));
      toast.success(`${selectedIds.size} nominee(s) marked as finalists`);

      // Update local state
      setNominees((prev) =>
        prev.map((n) =>
          selectedIds.has(n.nominee_id) ? { ...n, is_finalist: true } : n
        )
      );
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Error marking finalists:', error);
      toast.error('Failed to mark finalists');
    } finally {
      setSaving(false);
      setIsConfirmModalOpen(false);
    }
  };

  const handleRemoveFinalist = (nomineeId: string) => {
    setNomineeToRemove(nomineeId);
    setIsRemoveModalOpen(true);
  };

  const confirmRemoveFinalist = async () => {
    if (!nomineeToRemove) return;

    setSaving(true);
    try {
      // Note: We need to add a removeFinalist function to the service
      const { supabase } = await import('@/supabase/client');
      const { error } = await supabase
        .from('nominations')
        .update({ is_finalist: false } as never)
        .eq('category_id', categoryId)
        .eq('nominee_id', nomineeToRemove);

      if (error) throw error;

      toast.success('Finalist removed');
      setNominees((prev) =>
        prev.map((n) =>
          n.nominee_id === nomineeToRemove ? { ...n, is_finalist: false } : n
        )
      );
    } catch (error) {
      console.error('Error removing finalist:', error);
      toast.error('Failed to remove finalist');
    } finally {
      setSaving(false);
      setIsRemoveModalOpen(false);
      setNomineeToRemove(null);
    }
  };

  if (loading) {
    return (
      <main className='flex-1 p-6 lg:p-10'>
        <div className='flex justify-center items-center h-64'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
        </div>
      </main>
    );
  }

  const nonFinalists = nominees.filter((n) => !n.is_finalist);

  return (
    <main className='flex-1 p-6 lg:p-10'>
      <div className='mx-auto max-w-5xl'>
        {/* Breadcrumb & Header */}
        <div className='mb-6'>
          <Link
            href='/admin/nominations'
            className='text-sm text-gray-500 hover:text-primary flex items-center gap-1 mb-2'>
            <span className='material-symbols-outlined text-sm'>
              arrow_back
            </span>
            Back to Nominations
          </Link>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
            {category?.title || 'Category'}
          </h1>
          <p className='text-gray-500 dark:text-gray-400 mt-1'>
            Select up to {MAX_FINALISTS} nominees to become finalists for voting
          </p>
        </div>

        {/* Current Finalists */}
        {currentFinalists.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
              <span className='material-symbols-outlined text-green-500'>
                verified
              </span>
              Current Finalists ({currentFinalists.length}/{MAX_FINALISTS})
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {currentFinalists.map((nominee, index) => (
                <div
                  key={nominee.nominee_id}
                  className='flex items-center justify-between p-4 rounded-xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white text-sm font-bold'>
                      {index + 1}
                    </div>
                    <Avatar
                      src={nominee.nominee.avatar}
                      name={nominee.nominee.name}
                      className='w-10 h-10'
                    />
                    <div>
                      <p className='font-medium text-gray-900 dark:text-white'>
                        {nominee.nominee.name}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {nominee.nomination_count} nominations
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFinalist(nominee.nominee_id)}
                    className='p-2 text-gray-400 hover:text-red-500 transition-colors'
                    title='Remove finalist'>
                    <span className='material-symbols-outlined text-lg'>
                      close
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Nominees */}
        <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden'>
          <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h2 className='font-semibold text-gray-900 dark:text-white'>
                All Nominees ({nominees.length})
              </h2>
              {nonFinalists.length > 0 && canAddMore && (
                <button
                  onClick={handleSelectAll}
                  className='text-sm text-primary hover:text-primary/80'>
                  {selectedIds.size === nonFinalists.length
                    ? 'Deselect All'
                    : 'Select All'}
                </button>
              )}
            </div>
            {selectedCount > 0 && (
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                disabled={saving}
                className='flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-50'>
                <span className='material-symbols-outlined text-sm'>
                  check_circle
                </span>
                Confirm {selectedCount} Finalist{selectedCount > 1 ? 's' : ''}
              </button>
            )}
          </div>

          {nominees.length === 0 ? (
            <div className='p-12 text-center text-gray-500'>
              No approved nominations for this category yet.
            </div>
          ) : (
            <div className='divide-y divide-gray-200 dark:divide-gray-700'>
              {nominees.map((nominee, index) => (
                <div
                  key={nominee.nominee_id}
                  className={`flex items-center justify-between p-4 transition-colors ${
                    nominee.is_finalist
                      ? 'bg-green-50 dark:bg-green-900/10'
                      : selectedIds.has(nominee.nominee_id)
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}>
                  <div className='flex items-center gap-4'>
                    {/* Checkbox or Finalist badge */}
                    {nominee.is_finalist ? (
                      <div className='w-6 h-6 rounded-full bg-green-500 flex items-center justify-center'>
                        <span className='material-symbols-outlined text-white text-sm'>
                          check
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSelect(nominee.nominee_id)}
                        disabled={
                          !canAddMore && !selectedIds.has(nominee.nominee_id)
                        }
                        className={`w-6 h-6 rounded cursor-pointer border-2 flex items-center justify-center transition-colors ${
                          selectedIds.has(nominee.nominee_id)
                            ? 'bg-primary border-primary'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                        } ${
                          !canAddMore && !selectedIds.has(nominee.nominee_id)
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}>
                        {selectedIds.has(nominee.nominee_id) && (
                          <span className='material-symbols-outlined text-white text-sm'>
                            check
                          </span>
                        )}
                      </button>
                    )}

                    {/* Rank */}
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        index === 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : index === 1
                          ? 'bg-gray-100 text-gray-600'
                          : index === 2
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-50 text-gray-500'
                      }`}>
                      {index + 1}
                    </div>

                    {/* Avatar & Info */}
                    <Avatar
                      src={nominee.nominee.avatar}
                      name={nominee.nominee.name}
                      className='w-10 h-10'
                    />
                    <div>
                      <p className='font-medium text-gray-900 dark:text-white'>
                        {nominee.nominee.name}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {nominee.nominee.position} •{' '}
                        {nominee.nominee.department}
                      </p>
                    </div>
                  </div>

                  {/* Nomination count */}
                  <div className='flex items-center gap-4'>
                    <span className='text-sm font-semibold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300'>
                      {nominee.nomination_count} nomination
                      {nominee.nomination_count > 1 ? 's' : ''}
                    </span>
                    {nominee.is_finalist && (
                      <span className='text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1'>
                        <span className='material-symbols-outlined text-sm'>
                          verified
                        </span>
                        Finalist
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Finalists Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmFinalists}
        title='Confirm Finalists'
        message={`You are about to mark ${selectedCount} nominee${
          selectedCount > 1 ? 's' : ''
        } as finalist${
          selectedCount > 1 ? 's' : ''
        }. These finalists will appear in the voting phase for staff to vote on.`}
        confirmText='Confirm Finalists'
        isDangerous={false}
      />

      {/* Remove Finalist Modal */}
      <ConfirmationModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={confirmRemoveFinalist}
        title='Remove Finalist'
        message='Are you sure you want to remove this person from the finalists? They will no longer appear in the voting phase.'
        confirmText='Remove'
        isDangerous={true}
      />
    </main>
  );
}
