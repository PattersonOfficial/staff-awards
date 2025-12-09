'use client';

import { useEffect, useState } from 'react';
import { getCategories, Category } from '@/supabase/services/categories';
import { getStaff, StaffMember } from '@/supabase/services/staff'; // Need to export StaffMember if not exported, or use type
import { getVoteCounts } from '@/supabase/services/votes';
import {
  getNominationsByCategory,
  Nomination,
} from '@/supabase/services/nominations';

type Result = {
  nomineeId: string;
  nomineeName: string;
  nomineeAvatar: string;
  count: number;
};

type CategoryResult = {
  category: Category;
  results: Result[];
  totalVotes: number;
};

export default function AdminResultsPage() {
  const [data, setData] = useState<CategoryResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const categories = await getCategories();
        const staffList = await getStaff(); // Fetch all staff to lookup details if needed

        // Create lookup Map for staff
        const staffMap = new Map(staffList?.map((s) => [s.id, s]));

        const resultsData: CategoryResult[] = [];

        for (const cat of categories) {
          // Get Shortlisted Nominations to ensure we only show valid candidates (optional, but cleaner)
          const nominations = await getNominationsByCategory(cat.id);
          // Filter only shortlisted? Or show all who have votes?
          // Usually only shortlisted Candidates should handle votes.
          // But let's just use the votes table as the source of truth for counts.

          const votes = await getVoteCounts(cat.id);

          // Map votes to staff details
          const categoryResults: Result[] = votes
            .map((v) => {
              const staff = staffMap.get(v.nomineeId);
              return {
                nomineeId: v.nomineeId,
                nomineeName: staff?.name || 'Unknown',
                nomineeAvatar: staff?.avatar || '',
                count: v.count,
              };
            })
            .sort((a, b) => b.count - a.count); // Sort by highest votes

          resultsData.push({
            category: cat,
            results: categoryResults,
            totalVotes: categoryResults.reduce((sum, r) => sum + r.count, 0),
          });
        }

        setData(resultsData);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleExport = () => {
    if (data.length === 0) return;

    // Create CSV content
    const headers = ['Category', 'Nominee', 'Department', 'Votes', 'Is Winner'];
    const rows = data.flatMap((catItem) =>
      catItem.results.map((r, idx) => {
        const isWinner = idx === 0 && r.count > 0;
        return [
          `"${catItem.category.title}"`,
          `"${r.nomineeName}"`,
          // Department is not in result object currently, but we have staffMap in memory if we wanted.
          // For simplicity omitting or adding placeholder.
          // To do it right we'd need to reconstruct, but for MVP let's just dump what we have.
          `""`,
          r.count,
          isWinner ? 'Yes' : 'No',
        ].join(',');
      })
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'voting_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className='flex-1 p-6 lg:p-10'>
      <div className='mx-auto max-w-7xl'>
        <div className='flex flex-col gap-2 mb-8'>
          <div className='flex justify-between items-start'>
            <div>
              <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
                Voting Results
              </h1>
              <p className='text-gray-500 dark:text-gray-400'>
                Live vote counts for each category.
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={loading || data.length === 0}
              className='flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50'>
              <span className='material-symbols-outlined text-lg'>
                download
              </span>
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className='flex justify-center p-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-8'>
            {data.map((item) => (
              <div
                key={item.category.id}
                className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
                <div className='p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center'>
                  <div>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                      {item.category.title}
                    </h2>
                    <p className='text-sm text-gray-500'>
                      {item.totalVotes} total votes
                    </p>
                  </div>
                  {item.results.length > 0 && (
                    <div className='flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium'>
                      <span className='material-symbols-outlined text-base'>
                        emoji_events
                      </span>
                      Leader: {item.results[0].nomineeName}
                    </div>
                  )}
                </div>

                <div className='p-0'>
                  {item.results.length === 0 ? (
                    <div className='p-6 text-center text-gray-500'>
                      No votes cast yet.
                    </div>
                  ) : (
                    <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                      <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {item.results.map((result, index) => {
                          // Calculate percentage
                          const percentage =
                            item.totalVotes > 0
                              ? Math.round(
                                  (result.count / item.totalVotes) * 100
                                )
                              : 0;
                          const isWinner = index === 0 && result.count > 0;

                          return (
                            <tr
                              key={result.nomineeId}
                              className={isWinner ? 'bg-yellow-50/30' : ''}>
                              <td className='px-6 py-4 whitespace-nowrap w-12 text-gray-500 text-sm font-medium'>
                                #{index + 1}
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='flex items-center'>
                                  <div className='flex-shrink-0 h-8 w-8'>
                                    {result.nomineeAvatar ? (
                                      <img
                                        className='h-8 w-8 rounded-full object-cover'
                                        src={result.nomineeAvatar}
                                        alt=''
                                      />
                                    ) : (
                                      <div className='h-8 w-8 rounded-full bg-gray-200 items-center justify-center flex'>
                                        <span className='material-symbols-outlined text-xs'>
                                          person
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className='ml-4 font-medium text-gray-900 dark:text-white'>
                                    {result.nomineeName}
                                    {isWinner && (
                                      <span className='ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800'>
                                        Winner
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap w-full'>
                                <div className='flex items-center gap-3'>
                                  <div className='flex-1 h-2 bg-gray-100 rounded-full overflow-hidden'>
                                    <div
                                      className={`h-full rounded-full ${
                                        isWinner
                                          ? 'bg-yellow-500'
                                          : 'bg-primary'
                                      }`}
                                      style={{ width: `${percentage}%` }}></div>
                                  </div>
                                  <span className='text-sm text-gray-500 w-8'>
                                    {percentage}%
                                  </span>
                                </div>
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900 dark:text-white'>
                                {result.count}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
