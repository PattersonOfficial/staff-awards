'use client';

import { useEffect, useState } from 'react';
import {
  getNominations,
  updateNominationStatus,
  NominationWithDetails,
} from '@/supabase/services/nominations';
import { useToast } from '@/context/ToastContext';

export default function AdminNominationsPage() {
  const [nominations, setNominations] = useState<NominationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const { toast } = useToast();

  const fetchNominations = async () => {
    try {
      setLoading(true);
      const data = await getNominations();
      setNominations(data);
    } catch (error) {
      console.error('Error fetching nominations:', error);
      toast.error('Failed to load nominations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNominations();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: 'approved' | 'rejected'
  ) => {
    try {
      await updateNominationStatus(id, newStatus);
      setNominations((prev) =>
        prev.map((nom) => (nom.id === id ? { ...nom, status: newStatus } : nom))
      );
      toast.success(`Nomination ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredNominations = nominations.filter((nom) => {
    if (filter === 'all') return true;
    return nom.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className='flex-1 p-6 lg:p-10'>
      <div className='mx-auto max-w-7xl'>
        {/* Heading */}
        <div className='flex flex-col gap-2 mb-8'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Nominations
          </h1>
          <p className='text-gray-500 dark:text-gray-400'>
            Review and manage award nominations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className='flex gap-2 mb-6'>
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
              }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className='overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow'>
          {loading ? (
            <div className='flex p-12 justify-center'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
            </div>
          ) : filteredNominations.length === 0 ? (
            <div className='p-12 text-center text-gray-500'>
              No nominations found.
            </div>
          ) : (
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-900/50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Nominee
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Nominator
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Category
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Reason
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                {filteredNominations.map((nom) => (
                  <tr key={nom.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          {nom.nominee?.avatar ? (
                            <img
                              className='h-10 w-10 rounded-full object-cover'
                              src={nom.nominee.avatar}
                              alt=''
                            />
                          ) : (
                            <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                              <span className='material-symbols-outlined text-gray-400'>
                                person
                              </span>
                            </div>
                          )}
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900 dark:text-white'>
                            {nom.nominee?.name || 'Unknown'}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {nom.nominee?.department || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-700 dark:text-gray-300'>
                        {nom.nominator_email || 'Anonymous'}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900 dark:text-white'>
                        {nom.category?.title || 'Unknown Category'}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div
                        className='text-sm text-gray-500 max-w-xs truncate'
                        title={nom.reason || ''}>
                        {nom.reason}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          nom.status
                        )}`}>
                        {nom.status.toUpperCase()}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      {nom.status === 'pending' && (
                        <div className='flex justify-end gap-2'>
                          <button
                            onClick={() =>
                              handleStatusChange(nom.id, 'approved')
                            }
                            className='text-green-600 hover:text-green-900 bg-green-50 p-1.5 rounded-md hover:bg-green-100 transition-colors'
                            title='Approve'>
                            <span className='material-symbols-outlined text-lg'>
                              check
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(nom.id, 'rejected')
                            }
                            className='text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md hover:bg-red-100 transition-colors'
                            title='Reject'>
                            <span className='material-symbols-outlined text-lg'>
                              close
                            </span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
