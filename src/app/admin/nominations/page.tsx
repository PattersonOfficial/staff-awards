'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getNominations,
  updateNominationStatus,
  NominationWithDetails,
  getNominationLeaderboard,
  NominationLeaderboardItem,
} from '@/supabase/services/nominations';
import { useToast } from '@/context/ToastContext';
import Avatar from '@/components/ui/Avatar';
import Pagination from '@/components/ui/Pagination';

const ITEMS_PER_PAGE = 10;

export default function AdminNominationsPage() {
  const [nominations, setNominations] = useState<NominationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const [leaderboard, setLeaderboard] = useState<NominationLeaderboardItem[]>(
    []
  );

  const [recommendations, setRecommendations] = useState<
    {
      categoryId: string;
      categoryTitle: string;
      items: NominationLeaderboardItem[];
    }[]
  >([]);

  const processRecommendations = (
    data: { nominee: any; category: any; count: number }[]
  ) => {
    const grouped = new Map<string, typeof data>();
    data.forEach((item) => {
      const catId = item.category?.id;
      if (!catId) return;
      if (!grouped.has(catId)) grouped.set(catId, []);
      grouped.get(catId)?.push(item);
    });

    const result: {
      categoryId: string;
      categoryTitle: string;
      items: typeof data;
    }[] = [];
    grouped.forEach((items, catId) => {
      // Sort desc within category (already mostly sorted but ensure)
      items.sort((a, b) => b.count - a.count);
      // Take top 5
      if (items.length > 0) {
        result.push({
          categoryId: catId,
          categoryTitle: items[0].category.title,
          items: items.slice(0, 5), // Top 5 per category
        });
      }
    });
    return result;
  };

  const fetchNominations = async () => {
    try {
      setLoading(true);
      const [data, leaderboardData] = await Promise.all([
        getNominations(),
        getNominationLeaderboard(),
      ]);
      setNominations(data);
      setLeaderboard(leaderboardData);
      setRecommendations(processRecommendations(leaderboardData));
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

  // Pagination logic
  const totalPages = Math.ceil(filteredNominations.length / ITEMS_PER_PAGE);
  const paginatedNominations = filteredNominations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

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

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
              <span className='material-symbols-outlined text-yellow-500'>
                stars
              </span>
              Recommended for Shortlisting
            </h2>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {recommendations.map((rec) => (
                <div
                  key={rec.categoryId}
                  className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm'>
                  <div className='flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-2'>
                    <h3 className='font-bold text-gray-900 dark:text-white'>
                      {rec.categoryTitle}
                    </h3>
                    <Link
                      href={`/admin/nominations/category/${rec.categoryId}`}
                      className='text-xs font-semibold bg-primary/20 text-primary-accent hover:bg-primary/30 px-2 py-1 rounded-md flex items-center gap-1 transition-colors'>
                      View All
                      <span className='material-symbols-outlined text-sm'>
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                  <div className='space-y-4'>
                    {rec.items.map((item, index) => (
                      <div
                        key={item.nominee.id}
                        className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <div
                            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                              index === 0
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                            {index + 1}
                          </div>
                          <Avatar
                            src={item.nominee.avatar}
                            name={item.nominee.name}
                            className='w-8 h-8'
                            textClassName='text-sm'
                          />
                          <span className='text-sm font-medium text-gray-900 dark:text-white'>
                            {item.nominee.name}
                          </span>
                        </div>
                        <span className='text-xs font-semibold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300'>
                          {item.count} noms
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Table */}
        <div className='overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow'>
          {/* Filter Tabs */}
          <div className='flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700'>
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className='flex p-12 items-center justify-center min-h-[300px]'>
              <div className='h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
            </div>
          ) : filteredNominations.length === 0 ? (
            <div className='p-12 text-center text-gray-500'>
              No nominations found.
            </div>
          ) : (
            <div className='overflow-x-auto'>
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
                  {paginatedNominations.map((nom) => (
                    <tr key={nom.id}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <Avatar
                            src={nom.nominee?.avatar}
                            name={nom.nominee?.name || 'Unknown'}
                            className='h-10 w-10'
                          />
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
                              className='text-green-600 cursor-pointer hover:text-green-900 bg-green-50 p-1 pb-0! rounded-md hover:bg-green-100 transition-colors'
                              title='Approve'>
                              <span className='material-symbols-outlined text-xs'>
                                check
                              </span>
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(nom.id, 'rejected')
                              }
                              className='text-red-600 cursor-pointer hover:text-red-900 bg-red-50 p-1 pb-0! rounded-md hover:bg-red-100 transition-colors'
                              title='Reject'>
                              <span className='material-symbols-outlined text-xs'>
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
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredNominations.length}
          />
        </div>
      </div>
    </main>
  );
}
