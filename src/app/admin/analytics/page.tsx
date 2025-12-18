'use client';

import { useEffect, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import {
  getAnalyticsOverview,
  getNominationsByStatus,
  getNominationsByDepartment,
  getNominationsByCategory,
  getVotesByCategory,
  getTopNominees,
  getTopVoted,
  getDepartmentEngagement,
  type AnalyticsOverview,
  type StatusBreakdown,
  type DepartmentBreakdown,
  type CategoryBreakdown,
  type VotesByCategory,
  type TopNominee,
  type TopVoted,
  type DepartmentEngagement,
} from '@/supabase/services/analytics';

// Color palette for charts
const COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
];

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  approved: '#10B981',
  rejected: '#EF4444',
  shortlisted: '#3B82F6',
};

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdown[]>([]);
  const [deptBreakdown, setDeptBreakdown] = useState<DepartmentBreakdown[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<
    CategoryBreakdown[]
  >([]);
  const [votesByCategory, setVotesByCategory] = useState<VotesByCategory[]>([]);
  const [topNominees, setTopNominees] = useState<TopNominee[]>([]);
  const [topVoted, setTopVoted] = useState<TopVoted[]>([]);
  const [deptEngagement, setDeptEngagement] = useState<DepartmentEngagement[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [
          overviewData,
          statusData,
          deptData,
          catData,
          voteCatData,
          topNomineesData,
          topVotedData,
          engagementData,
        ] = await Promise.all([
          getAnalyticsOverview(),
          getNominationsByStatus(),
          getNominationsByDepartment(),
          getNominationsByCategory(),
          getVotesByCategory(),
          getTopNominees(5),
          getTopVoted(5),
          getDepartmentEngagement(),
        ]);

        setOverview(overviewData);
        setStatusBreakdown(statusData);
        setDeptBreakdown(deptData);
        setCategoryBreakdown(catData);
        setVotesByCategory(voteCatData);
        setTopNominees(topNomineesData);
        setTopVoted(topVotedData);
        setDeptEngagement(engagementData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  const maxDeptCount = Math.max(...deptBreakdown.map((d) => d.count), 1);
  const maxCatCount = Math.max(...categoryBreakdown.map((c) => c.count), 1);
  const maxVoteCatCount = Math.max(
    ...votesByCategory.map((v) => v.voteCount),
    1
  );
  const maxEngagement = Math.max(
    ...deptEngagement.map((d) => d.engagementScore),
    1
  );

  return (
    <main className='flex-1 p-6 lg:p-10 overflow-y-auto'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='flex flex-col gap-2 mb-8'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Analytics
          </h1>
          <p className='text-text-light-secondary dark:text-text-dark-secondary'>
            In-depth insights into nominations, voting, and participation.
          </p>
        </div>

        {/* Overview Stats Grid */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
          <StatCard
            label='Total Nominations'
            value={overview?.totalNominations || 0}
            icon='rate_review'
            color='blue'
          />
          <StatCard
            label='Total Votes'
            value={overview?.totalVotes || 0}
            icon='how_to_vote'
            color='green'
          />
          <StatCard
            label='Participation Rate'
            value={`${overview?.participationRate || 0}%`}
            icon='groups'
            color='purple'
          />
          <StatCard
            label='Active Categories'
            value={overview?.totalCategories || 0}
            icon='category'
            color='amber'
          />
        </div>

        {/* Status Breakdown & Department Breakdown */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* Nomination Status - Donut Chart */}
          <div className='rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Nominations by Status
            </h2>
            {statusBreakdown.length > 0 ? (
              <div className='flex items-center gap-8'>
                {/* Donut Chart */}
                <div className='relative w-40 h-40'>
                  <svg
                    viewBox='0 0 100 100'
                    className='w-full h-full transform -rotate-90'>
                    {(() => {
                      let offset = 0;
                      const total = statusBreakdown.reduce(
                        (sum, s) => sum + s.count,
                        0
                      );
                      return statusBreakdown.map((item) => {
                        const percentage =
                          total > 0 ? (item.count / total) * 100 : 0;
                        const strokeDasharray = `${percentage} ${
                          100 - percentage
                        }`;
                        const currentOffset = offset;
                        offset += percentage;
                        return (
                          <circle
                            key={item.status}
                            cx='50'
                            cy='50'
                            r='40'
                            fill='none'
                            stroke={STATUS_COLORS[item.status] || '#6B7280'}
                            strokeWidth='20'
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={-currentOffset}
                            className='transition-all duration-500'
                          />
                        );
                      });
                    })()}
                  </svg>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='text-center'>
                      <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                        {overview?.totalNominations || 0}
                      </p>
                      <p className='text-xs text-gray-500'>Total</p>
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className='flex-1 space-y-2'>
                  {statusBreakdown.map((item) => (
                    <div
                      key={item.status}
                      className='flex items-center justify-between gap-2'>
                      <div className='flex items-center gap-2'>
                        <div
                          className='w-3 h-3 rounded-full'
                          style={{
                            backgroundColor:
                              STATUS_COLORS[item.status] || '#6B7280',
                          }}
                        />
                        <span className='text-sm text-gray-600 dark:text-gray-300 capitalize'>
                          {item.status}
                        </span>
                      </div>
                      <span className='text-sm font-bold text-gray-900 dark:text-white'>
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className='text-gray-500 text-center py-8'>
                No nominations yet
              </p>
            )}
          </div>

          {/* Department Breakdown */}
          <div className='rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Nominations by Department
            </h2>
            <div className='space-y-3 max-h-64 overflow-y-auto'>
              {deptBreakdown.slice(0, 8).map((item, index) => (
                <div key={item.department} className='flex items-center gap-3'>
                  <span className='text-sm text-gray-600 dark:text-gray-300 truncate w-28'>
                    {item.department}
                  </span>
                  <div className='flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden'>
                    <div
                      className='h-full rounded-full transition-all duration-500'
                      style={{
                        width: `${(item.count / maxDeptCount) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                  <span className='text-sm font-bold text-gray-900 dark:text-white w-12 text-right'>
                    {item.count}
                  </span>
                </div>
              ))}
              {deptBreakdown.length === 0 && (
                <p className='text-gray-500 text-center py-4'>No data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Category Breakdowns - Vertical Bar Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* Nominations by Category - Vertical Bar Chart */}
          <div className='rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Nominations by Category
            </h2>
            {categoryBreakdown.length > 0 ? (
              <div className='flex items-end gap-3 h-48'>
                {categoryBreakdown.slice(0, 6).map((item, index) => (
                  <div
                    key={item.categoryId}
                    className='flex-1 flex flex-col items-center gap-2'>
                    <span className='text-xs font-bold text-gray-900 dark:text-white'>
                      {item.count}
                    </span>
                    <div
                      className='w-full rounded-t-lg transition-all duration-500'
                      style={{
                        height: `${(item.count / maxCatCount) * 140}px`,
                        backgroundColor: COLORS[index % COLORS.length],
                        minHeight: '8px',
                      }}
                    />
                    <span
                      className='text-xs text-gray-500 truncate w-full text-center'
                      title={item.categoryTitle}>
                      {item.categoryTitle.slice(0, 8)}...
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500 text-center py-8'>No data yet</p>
            )}
          </div>

          {/* Votes by Category - Vertical Bar Chart */}
          <div className='rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Votes by Category
            </h2>
            {votesByCategory.length > 0 ? (
              <div className='flex items-end gap-3 h-48'>
                {votesByCategory.slice(0, 6).map((item, index) => (
                  <div
                    key={item.categoryId}
                    className='flex-1 flex flex-col items-center gap-2'>
                    <span className='text-xs font-bold text-gray-900 dark:text-white'>
                      {item.voteCount}
                    </span>
                    <div
                      className='w-full rounded-t-lg transition-all duration-500'
                      style={{
                        height: `${(item.voteCount / maxVoteCatCount) * 140}px`,
                        backgroundColor: COLORS[(index + 2) % COLORS.length],
                        minHeight: '8px',
                      }}
                    />
                    <span
                      className='text-xs text-gray-500 truncate w-full text-center'
                      title={item.categoryTitle}>
                      {item.categoryTitle.slice(0, 8)}...
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500 text-center py-8'>No votes yet</p>
            )}
          </div>
        </div>

        {/* Leaderboards */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* Top Nominees */}
          <div className='rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
              <span className='material-symbols-outlined text-amber-500'>
                military_tech
              </span>
              Top Nominated Staff
            </h2>
            <div className='space-y-3'>
              {topNominees.map((nominee, index) => (
                <div
                  key={nominee.nomineeId}
                  className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50'>
                  <span className='text-lg font-bold text-gray-400 w-6'>
                    {index + 1}
                  </span>
                  <Avatar
                    src={nominee.avatar}
                    name={nominee.nomineeName}
                    className='w-10 h-10'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='font-semibold text-gray-900 dark:text-white truncate'>
                      {nominee.nomineeName}
                    </p>
                    <p className='text-xs text-gray-500 truncate'>
                      {nominee.department}
                    </p>
                  </div>
                  <div className='px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold'>
                    {nominee.nominationCount}
                  </div>
                </div>
              ))}
              {topNominees.length === 0 && (
                <p className='text-gray-500 text-center py-4'>
                  No nominations yet
                </p>
              )}
            </div>
          </div>

          {/* Top Voted */}
          <div className='rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
              <span className='material-symbols-outlined text-green-500'>
                emoji_events
              </span>
              Top Voted Candidates
            </h2>
            <div className='space-y-3'>
              {topVoted.map((candidate, index) => (
                <div
                  key={`${candidate.nomineeId}-${candidate.categoryTitle}`}
                  className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50'>
                  <span className='text-lg font-bold text-gray-400 w-6'>
                    {index + 1}
                  </span>
                  <Avatar
                    src={candidate.avatar}
                    name={candidate.nomineeName}
                    className='w-10 h-10'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='font-semibold text-gray-900 dark:text-white truncate'>
                      {candidate.nomineeName}
                    </p>
                    <p className='text-xs text-gray-500 truncate'>
                      {candidate.categoryTitle}
                    </p>
                  </div>
                  <div className='px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-bold'>
                    {candidate.voteCount}
                  </div>
                </div>
              ))}
              {topVoted.length === 0 && (
                <p className='text-gray-500 text-center py-4'>No votes yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Department Engagement */}
        <div className='rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Department Engagement
          </h2>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-200 dark:border-gray-700'>
                  <th className='text-left py-3 px-2 font-semibold text-gray-600 dark:text-gray-400'>
                    Department
                  </th>
                  <th className='text-center py-3 px-2 font-semibold text-gray-600 dark:text-gray-400'>
                    Staff
                  </th>
                  <th className='text-center py-3 px-2 font-semibold text-gray-600 dark:text-gray-400'>
                    Nominations
                  </th>
                  <th className='text-center py-3 px-2 font-semibold text-gray-600 dark:text-gray-400'>
                    Votes
                  </th>
                  <th className='text-left py-3 px-2 font-semibold text-gray-600 dark:text-gray-400'>
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody>
                {deptEngagement.slice(0, 10).map((dept, index) => (
                  <tr
                    key={dept.department}
                    className='border-b border-gray-100 dark:border-gray-700/50'>
                    <td className='py-3 px-2 font-medium text-gray-900 dark:text-white'>
                      {dept.department}
                    </td>
                    <td className='py-3 px-2 text-center text-gray-600 dark:text-gray-300'>
                      {dept.staffCount}
                    </td>
                    <td className='py-3 px-2 text-center text-gray-600 dark:text-gray-300'>
                      {dept.nominationsReceived}
                    </td>
                    <td className='py-3 px-2 text-center text-gray-600 dark:text-gray-300'>
                      {dept.votesReceived}
                    </td>
                    <td className='py-3 px-2'>
                      <div className='flex items-center gap-2'>
                        <div className='w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden'>
                          <div
                            className='h-full rounded-full transition-all duration-500'
                            style={{
                              width: `${
                                (dept.engagementScore / maxEngagement) * 100
                              }%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                        <span className='text-xs font-medium text-gray-500'>
                          {dept.engagementScore}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {deptEngagement.length === 0 && (
              <p className='text-gray-500 text-center py-8'>
                No engagement data yet
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'amber';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green:
      'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple:
      'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    amber:
      'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  };

  return (
    <div className='rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'>
      <div className='flex items-center gap-3'>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <span className='material-symbols-outlined'>{icon}</span>
        </div>
        <div>
          <p className='text-2xl font-bold text-gray-900 dark:text-white'>
            {value}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>{label}</p>
        </div>
      </div>
    </div>
  );
}
