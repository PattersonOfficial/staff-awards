import { supabase } from '../client';

// ==================== TYPE DEFINITIONS ====================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryResult = any;

// ==================== OVERVIEW STATS ====================

export interface AnalyticsOverview {
  totalNominations: number;
  totalVotes: number;
  totalStaff: number;
  totalCategories: number;
  pendingNominations: number;
  approvedNominations: number;
  rejectedNominations: number;
  shortlistedNominations: number;
  participationRate: number;
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const [
    { count: totalNominations },
    { count: totalVotes },
    { count: totalStaff },
    { count: totalCategories },
    { count: pendingNominations },
    { count: approvedNominations },
    { count: rejectedNominations },
    { count: shortlistedNominations },
  ] = await Promise.all([
    supabase.from('nominations').select('*', { count: 'exact', head: true }),
    supabase.from('votes').select('*', { count: 'exact', head: true }),
    supabase.from('staff').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase
      .from('nominations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('nominations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved'),
    supabase
      .from('nominations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected'),
    supabase
      .from('nominations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'shortlisted'),
  ]);

  // Calculate participation rate (unique nominees / total staff)
  const { data: rawNominees } = await supabase
    .from('nominations')
    .select('nominee_id');

  const nominees = (rawNominees || []) as QueryResult[];
  const uniqueNomineeCount = new Set(nominees.map((n) => n.nominee_id)).size;
  const participationRate = totalStaff
    ? Math.round((uniqueNomineeCount / (totalStaff || 1)) * 100)
    : 0;

  return {
    totalNominations: totalNominations || 0,
    totalVotes: totalVotes || 0,
    totalStaff: totalStaff || 0,
    totalCategories: totalCategories || 0,
    pendingNominations: pendingNominations || 0,
    approvedNominations: approvedNominations || 0,
    rejectedNominations: rejectedNominations || 0,
    shortlistedNominations: shortlistedNominations || 0,
    participationRate,
  };
}

// ==================== NOMINATIONS BY STATUS ====================

export interface StatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}

export async function getNominationsByStatus(): Promise<StatusBreakdown[]> {
  const { data, error } = await supabase.from('nominations').select('status');

  if (error) throw error;

  const nominations = (data || []) as QueryResult[];
  const counts: Record<string, number> = {};
  const total = nominations.length;

  nominations.forEach((nom) => {
    const status = nom.status || 'unknown';
    counts[status] = (counts[status] || 0) + 1;
  });

  return Object.entries(counts).map(([status, count]) => ({
    status,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }));
}

// ==================== NOMINATIONS BY DEPARTMENT ====================

export interface DepartmentBreakdown {
  department: string;
  count: number;
  percentage: number;
}

export async function getNominationsByDepartment(): Promise<
  DepartmentBreakdown[]
> {
  const { data, error } = await supabase
    .from('nominations')
    .select('nominee:staff!nominations_nominee_id_fkey(department)');

  if (error) throw error;

  const nominations = (data || []) as QueryResult[];
  const counts: Record<string, number> = {};
  const total = nominations.length;

  nominations.forEach((nom) => {
    const dept = nom.nominee?.department || 'Unknown';
    counts[dept] = (counts[dept] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([department, count]) => ({
      department,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

// ==================== NOMINATIONS BY CATEGORY ====================

export interface CategoryBreakdown {
  categoryId: string;
  categoryTitle: string;
  count: number;
  percentage: number;
}

export async function getNominationsByCategory(): Promise<CategoryBreakdown[]> {
  const { data, error } = await supabase
    .from('nominations')
    .select(
      'category_id, category:categories!nominations_category_id_fkey(id, title)'
    );

  if (error) throw error;

  const nominations = (data || []) as QueryResult[];
  const counts: Record<string, { title: string; count: number }> = {};
  const total = nominations.length;

  nominations.forEach((nom) => {
    const catId = nom.category_id || 'unknown';
    const catTitle = nom.category?.title || 'Unknown Category';

    if (!counts[catId]) {
      counts[catId] = { title: catTitle, count: 0 };
    }
    counts[catId].count++;
  });

  return Object.entries(counts)
    .map(([categoryId, { title, count }]) => ({
      categoryId,
      categoryTitle: title,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

// ==================== VOTES BY CATEGORY ====================

export interface VotesByCategory {
  categoryId: string;
  categoryTitle: string;
  voteCount: number;
}

export async function getVotesByCategory(): Promise<VotesByCategory[]> {
  const { data, error } = await supabase
    .from('votes')
    .select(
      'category_id, category:categories!votes_category_id_fkey(id, title)'
    );

  if (error) throw error;

  const votes = (data || []) as QueryResult[];
  const counts: Record<string, { title: string; count: number }> = {};

  votes.forEach((vote) => {
    const catId = vote.category_id || 'unknown';
    const catTitle = vote.category?.title || 'Unknown Category';

    if (!counts[catId]) {
      counts[catId] = { title: catTitle, count: 0 };
    }
    counts[catId].count++;
  });

  return Object.entries(counts)
    .map(([categoryId, { title, count }]) => ({
      categoryId,
      categoryTitle: title,
      voteCount: count,
    }))
    .sort((a, b) => b.voteCount - a.voteCount);
}

// ==================== TOP NOMINEES (Most Nominated) ====================

export interface TopNominee {
  nomineeId: string;
  nomineeName: string;
  department: string;
  avatar: string | null;
  nominationCount: number;
}

export async function getTopNominees(limit = 10): Promise<TopNominee[]> {
  // Get ALL nominations (not just approved/shortlisted) so data shows even for pending
  const { data, error } = await supabase
    .from('nominations')
    .select(
      'nominee_id, nominee:staff!nominations_nominee_id_fkey(id, name, department, avatar)'
    );

  if (error) throw error;

  const nominations = (data || []) as QueryResult[];
  const counts: Record<
    string,
    { name: string; department: string; avatar: string | null; count: number }
  > = {};

  nominations.forEach((nom) => {
    const id = nom.nominee_id || 'unknown';

    if (!counts[id]) {
      counts[id] = {
        name: nom.nominee?.name || 'Unknown',
        department: nom.nominee?.department || 'Unknown',
        avatar: nom.nominee?.avatar || null,
        count: 0,
      };
    }
    counts[id].count++;
  });

  return Object.entries(counts)
    .map(([nomineeId, { name, department, avatar, count }]) => ({
      nomineeId,
      nomineeName: name,
      department,
      avatar,
      nominationCount: count,
    }))
    .sort((a, b) => b.nominationCount - a.nominationCount)
    .slice(0, limit);
}

// ==================== TOP VOTED (Highest Vote Counts) ====================

export interface TopVoted {
  nomineeId: string;
  nomineeName: string;
  categoryTitle: string;
  voteCount: number;
  avatar: string | null;
}

export async function getTopVoted(limit = 10): Promise<TopVoted[]> {
  const { data, error } = await supabase.from('votes').select(`
      nominee_id,
      category:categories!votes_category_id_fkey(title),
      nominee:staff!votes_nominee_id_fkey(id, name, avatar)
    `);

  if (error) throw error;

  const votes = (data || []) as QueryResult[];
  const counts: Record<
    string,
    { name: string; category: string; avatar: string | null; count: number }
  > = {};

  votes.forEach((vote) => {
    const key = `${vote.nominee_id}_${vote.category?.title || 'unknown'}`;

    if (!counts[key]) {
      counts[key] = {
        name: vote.nominee?.name || 'Unknown',
        category: vote.category?.title || 'Unknown',
        avatar: vote.nominee?.avatar || null,
        count: 0,
      };
    }
    counts[key].count++;
  });

  return Object.entries(counts)
    .map(([key, { name, category, avatar, count }]) => ({
      nomineeId: key.split('_')[0],
      nomineeName: name,
      categoryTitle: category,
      voteCount: count,
      avatar,
    }))
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, limit);
}

// ==================== DEPARTMENT ENGAGEMENT ====================

export interface DepartmentEngagement {
  department: string;
  staffCount: number;
  nominationsReceived: number;
  votesReceived: number;
  engagementScore: number;
}

export async function getDepartmentEngagement(): Promise<
  DepartmentEngagement[]
> {
  // Get all departments with staff counts
  const { data: staffData, error: staffError } = await supabase
    .from('staff')
    .select('department');

  if (staffError) throw staffError;

  const staff = (staffData || []) as QueryResult[];
  const deptStaffCounts: Record<string, number> = {};
  staff.forEach((s) => {
    const dept = s.department || 'Unknown';
    deptStaffCounts[dept] = (deptStaffCounts[dept] || 0) + 1;
  });

  // Get nominations per department
  const { data: nomData, error: nomError } = await supabase
    .from('nominations')
    .select('nominee:staff!nominations_nominee_id_fkey(department)');

  if (nomError) throw nomError;

  const nominations = (nomData || []) as QueryResult[];
  const deptNomCounts: Record<string, number> = {};
  nominations.forEach((n) => {
    const dept = n.nominee?.department || 'Unknown';
    deptNomCounts[dept] = (deptNomCounts[dept] || 0) + 1;
  });

  // Get votes per department (for nominees)
  const { data: voteData, error: voteError } = await supabase
    .from('votes')
    .select('nominee:staff!votes_nominee_id_fkey(department)');

  if (voteError) throw voteError;

  const votesData = (voteData || []) as QueryResult[];
  const deptVoteCounts: Record<string, number> = {};
  votesData.forEach((v) => {
    const dept = v.nominee?.department || 'Unknown';
    deptVoteCounts[dept] = (deptVoteCounts[dept] || 0) + 1;
  });

  // Combine data
  const allDepts = new Set([
    ...Object.keys(deptStaffCounts),
    ...Object.keys(deptNomCounts),
    ...Object.keys(deptVoteCounts),
  ]);

  return Array.from(allDepts)
    .map((department) => {
      const staffCount = deptStaffCounts[department] || 0;
      const nominationsReceived = deptNomCounts[department] || 0;
      const votesReceived = deptVoteCounts[department] || 0;

      const engagementScore =
        staffCount > 0
          ? Math.round(
              ((nominationsReceived * 2 + votesReceived) / staffCount) * 10
            )
          : 0;

      return {
        department,
        staffCount,
        nominationsReceived,
        votesReceived,
        engagementScore,
      };
    })
    .sort((a, b) => b.engagementScore - a.engagementScore);
}
