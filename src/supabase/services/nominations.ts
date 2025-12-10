import { supabase } from '../client';
import type { Tables, InsertTables, UpdateTables } from '../types';

export type Nomination = Tables<'nominations'>;
export type NominationInsert = InsertTables<'nominations'>;
export type NominationUpdate = UpdateTables<'nominations'>;

export type NominationWithDetails = Nomination & {
  nominee: Tables<'staff'>;
  // nominator: Tables<'staff'> | null; // Removed because we decoupled from staff
  category: Tables<'categories'>;
};

export async function createNomination(
  nomination: NominationInsert
): Promise<Nomination> {
  const { data, error } = await supabase
    .from('nominations')
    .insert(nomination as never)
    .select()
    .single();

  if (error) throw error;
  return data as Nomination;
}

export async function getNominations(): Promise<NominationWithDetails[]> {
  const { data, error } = await supabase
    .from('nominations')
    .select(
      `
      *,
      nominee:staff!nominations_nominee_id_fkey(*),
      category:categories!nominations_category_id_fkey(*)
    `
    )
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as unknown as NominationWithDetails[];
}

export async function getNominationById(
  id: string
): Promise<NominationWithDetails> {
  const { data, error } = await supabase
    .from('nominations')
    .select(
      `
      *,
      nominee:staff!nominations_nominee_id_fkey(*),
      category:categories!nominations_category_id_fkey(*)
    `
    )
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as unknown as NominationWithDetails;
}

export async function getNominationsByCategory(
  categoryId: string
): Promise<NominationWithDetails[]> {
  const { data, error } = await supabase
    .from('nominations')
    .select(
      `
      *,
      nominee:staff!nominations_nominee_id_fkey(*),
      category:categories!nominations_category_id_fkey(*)
    `
    )
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as unknown as NominationWithDetails[];
}

export async function getNominationsByNominator(
  nominatorId: string
): Promise<NominationWithDetails[]> {
  const { data, error } = await supabase
    .from('nominations')
    .select(
      `
      *,
      nominee:staff!nominations_nominee_id_fkey(*),
      category:categories!nominations_category_id_fkey(*)
    `
    )
    .eq('nominator_id', nominatorId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as unknown as NominationWithDetails[];
}

// Alias for backward compatibility if needed, though useNominations uses the above
export const getNominationsByNominatorId = getNominationsByNominator;

export async function getPendingNominations(): Promise<
  NominationWithDetails[]
> {
  const { data, error } = await supabase
    .from('nominations')
    .select(
      `
      *,
      nominee:staff!nominations_nominee_id_fkey(*),
      category:categories!nominations_category_id_fkey(*)
    `
    )
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as unknown as NominationWithDetails[];
}

export async function getShortlistedNominations(
  categoryId?: string
): Promise<NominationWithDetails[]> {
  let query = supabase
    .from('nominations')
    .select(
      `
      *,
      nominee:staff!nominations_nominee_id_fkey(*),
      category:categories!nominations_category_id_fkey(*)
    `
    )
    .eq('status', 'shortlisted');

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as unknown as NominationWithDetails[];
}

export async function updateNominationStatus(
  id: string,
  status: 'approved' | 'rejected' | 'shortlisted'
): Promise<Nomination> {
  const { data, error } = await supabase
    .from('nominations')
    .update({ status } as never)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Nomination;
}

// Convenience wrappers
export async function approveNomination(id: string): Promise<Nomination> {
  return updateNominationStatus(id, 'approved');
}

export async function rejectNomination(id: string): Promise<Nomination> {
  return updateNominationStatus(id, 'rejected');
}

export async function shortlistNomination(id: string): Promise<Nomination> {
  return updateNominationStatus(id, 'shortlisted');
}

export async function deleteNomination(id: string): Promise<void> {
  const { error } = await supabase.from('nominations').delete().eq('id', id);
  if (error) throw error;
}

export async function getNominationCounts() {
  const { count: total } = await supabase
    .from('nominations')
    .select('*', { count: 'exact', head: true });
  const { count: pending } = await supabase
    .from('nominations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');
  const { count: approved } = await supabase
    .from('nominations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');
  const { count: rejected } = await supabase
    .from('nominations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'rejected');
  const { count: shortlisted } = await supabase
    .from('nominations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'shortlisted');

    rejected: rejected || 0,
    rejected: rejected || 0,
    shortlisted: shortlisted || 0,
  };
} // End of getNominationCounts function

export interface NominationLeaderboardItem {
  nominee: Tables<'staff'>;
  category: Tables<'categories'>;
  count: number;
}

export async function getNominationLeaderboard(): Promise<
  NominationLeaderboardItem[]
> {
  const { data, error } = await supabase
    .from('nominations')
    .select(
      `
      nominee_id,
      category_id,
      nominee:staff!nominations_nominee_id_fkey(*),
      category:categories!nominations_category_id_fkey(*)
    `
    )
    .not('status', 'eq', 'rejected');

  if (error) throw error;

  const rawData = data as unknown as {
    nominee_id: string;
    category_id: string;
    nominee: Tables<'staff'>;
    category: Tables<'categories'>;
  }[];

  // Key: nomineeId_categoryId
  const counts = new Map<string, number>();
  const metaMap = new Map<
    string,
    { nominee: Tables<'staff'>; category: Tables<'categories'> }
  >();

  rawData.forEach((item) => {
    const key = `${item.nominee_id}_${item.category_id}`;
    if (!item.nominee_id || !item.category_id) return;

    counts.set(key, (counts.get(key) || 0) + 1);
    if (!metaMap.has(key)) {
      metaMap.set(key, { nominee: item.nominee, category: item.category });
    }
  });

  const leaderboard: NominationLeaderboardItem[] = [];
  counts.forEach((count, key) => {
    const meta = metaMap.get(key);
    if (meta) {
      leaderboard.push({
        nominee: meta.nominee,
        category: meta.category,
        count,
      });
    }
  });

  // Sort by count descending
  return leaderboard.sort((a, b) => b.count - a.count);
}
