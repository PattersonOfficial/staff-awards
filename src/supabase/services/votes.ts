import { supabase } from '../client';
import type { Tables, InsertTables } from '../types';

export type Vote = Tables<'votes'>;
export type VoteInsert = InsertTables<'votes'>;

export async function castVote(vote: VoteInsert): Promise<Vote> {
  const { data, error } = await supabase
    .from('votes')
    .insert(vote as never)
    .select()
    .single();

  if (error) throw error;
  return data as Vote;
}

export async function hasUserVoted(
  categoryId: string,
  voterId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('votes')
    .select('id')
    .eq('category_id', categoryId)
    .eq('voter_id', voterId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export interface VoteCount {
  nomineeId: string;
  count: number;
}

export async function getVoteCounts(categoryId: string): Promise<VoteCount[]> {
  // Option 1: Use .rpc() if we had a stored procedure (better for performance)
  // Option 2: Fetch all votes and count client-side (easier for MVP, ok for small scale)

  // Let's use Option 2 for now as we don't have an RPC function set up
  const { data, error } = await supabase
    .from('votes')
    .select('nominee_id')
    .eq('category_id', categoryId);

  if (error) throw error;

  const votes = data as unknown as { nominee_id: string }[];

  const counts: Record<string, number> = {};
  votes.forEach((vote) => {
    counts[vote.nominee_id] = (counts[vote.nominee_id] || 0) + 1;
  });

  return Object.entries(counts).map(([nomineeId, count]) => ({
    nomineeId,
    count,
  }));
}

export async function getTotalVotes(): Promise<number> {
  const { count, error } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}
