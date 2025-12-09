import { supabase } from '../client';
import type { Tables, InsertTables } from '../types';

export type VoteRow = Tables<'votes'>;
export type VoteInsert = InsertTables<'votes'>;

export interface VoteWithDetails extends VoteRow {
  voter: Tables<'staff'>;
  nominee: Tables<'staff'>;
  category: Tables<'categories'>;
}

export interface VotingResult {
  categoryId: string;
  category: Tables<'categories'>;
  nominees: {
    nominee: Tables<'staff'>;
    voteCount: number;
    percentage: number;
  }[];
  totalVotes: number;
}

export async function getVotes() {
  const { data, error } = await supabase
    .from('votes')
    .select(
      `
      *,
      voter:staff!votes_voter_id_fkey(*),
      category:categories(*)
    `
    )
    .order('voted_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getVotesByCategory(categoryId: string) {
  const { data, error } = await supabase
    .from('votes')
    .select(
      `
      *,
      voter:staff!votes_voter_id_fkey(*)
    `
    )
    .eq('category_id', categoryId)
    .order('voted_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getVotesByVoter(voterId: string) {
  const { data, error } = await supabase
    .from('votes')
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq('voter_id', voterId)
    .order('voted_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function hasUserVotedInCategory(
  voterId: string,
  categoryId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('votes')
    .select('id')
    .eq('voter_id', voterId)
    .eq('category_id', categoryId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export async function castVote(vote: VoteInsert): Promise<VoteRow> {
  // Use upsert to allow changing votes (requires unique constraint on voter_id + category_id)
  const { data, error } = await supabase
    .from('votes')
    .upsert(vote as never, { onConflict: 'voter_id, category_id' })
    .select()
    .single();

  if (error) throw error;
  return data as VoteRow;
}

export async function deleteVote(id: string): Promise<void> {
  const { error } = await supabase.from('votes').delete().eq('id', id);

  if (error) throw error;
}

// Get voting results for a category
export async function getVotingResults(
  categoryId: string
): Promise<VotingResult | null> {
  // Get category
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .single();

  if (categoryError) throw categoryError;
  if (!category) return null;

  // Get all votes for this category
  const { data: votes, error: votesError } = await supabase
    .from('votes')
    .select('nominee_id')
    .eq('category_id', categoryId);

  if (votesError) throw votesError;

  const voteData = votes as { nominee_id: string }[];
  const totalVotes = voteData.length;

  if (totalVotes === 0) {
    return {
      categoryId,
      category: category as Tables<'categories'>,
      nominees: [],
      totalVotes: 0,
    };
  }

  // Count votes per nominee
  const voteCounts: Record<string, number> = {};
  voteData.forEach((vote) => {
    voteCounts[vote.nominee_id] = (voteCounts[vote.nominee_id] || 0) + 1;
  });

  // Get nominee details
  const nomineeIds = Object.keys(voteCounts);
  const { data: nominees, error: nomineesError } = await supabase
    .from('staff')
    .select('*')
    .in('id', nomineeIds);

  if (nomineesError) throw nomineesError;

  const staffData = nominees as Tables<'staff'>[];

  // Build results
  const nomineeResults = staffData
    .map((nominee) => ({
      nominee,
      voteCount: voteCounts[nominee.id] || 0,
      percentage: Math.round(
        ((voteCounts[nominee.id] || 0) / totalVotes) * 100
      ),
    }))
    .sort((a, b) => b.voteCount - a.voteCount);

  return {
    categoryId,
    category: category as Tables<'categories'>,
    nominees: nomineeResults,
    totalVotes,
  };
}

// Get all voting results
export async function getAllVotingResults(): Promise<VotingResult[]> {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id')
    .eq('status', 'published');

  if (error) throw error;

  const categoryData = categories as { id: string }[];

  const results = await Promise.all(
    categoryData.map((cat) => getVotingResults(cat.id))
  );

  return results.filter((r): r is VotingResult => r !== null);
}
