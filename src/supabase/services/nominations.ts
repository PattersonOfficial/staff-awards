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
  // Check for duplicate using nominator_user_id (Auth UUID)
  if (nomination.nominator_user_id) {
    const { data: existing } = await supabase
      .from('nominations')
      .select('id')
      .eq('category_id', nomination.category_id)
      .eq('nominee_id', nomination.nominee_id)
      .eq('nominator_user_id', nomination.nominator_user_id)
      .maybeSingle();

    if (existing) {
      throw new Error(
        'You have already nominated this person for this category.'
      );
    }
  }

  const { data, error } = await supabase
    .from('nominations')
    .insert(nomination as never)
    .select()
    .single();

  if (error) {
    // Fallback for race conditions (unique constraint violation)
    if (error.code === '23505') {
      throw new Error(
        'You have already nominated this person for this category.'
      );
    }
    throw error;
  }
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

// Get nominations by Auth User UUID (primary method)
export async function getNominationsByUserUid(
  userUid: string
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
    .eq('nominator_user_id', userUid)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as unknown as NominationWithDetails[];
}

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

  return {
    total: total || 0,
    pending: pending || 0,
    approved: approved || 0,
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

// ==================== FINALIST FUNCTIONS ====================

export interface NomineeWithCount {
  nominee_id: string;
  nominee: Tables<'staff'>;
  nomination_count: number;
  is_finalist: boolean;
}

/**
 * Get all nominees for a category with their nomination counts and finalist status
 */
export async function getNomineesForCategoryWithCounts(
  categoryId: string
): Promise<NomineeWithCount[]> {
  const { data, error } = await supabase
    .from('nominations')
    .select(
      `
      nominee_id,
      is_finalist,
      nominee:staff!nominations_nominee_id_fkey(*)
    `
    )
    .eq('category_id', categoryId)
    .eq('status', 'approved');

  if (error) throw error;
  if (!data) return [];

  // Define type for query result (is_finalist may not be in generated types yet)
  type NominationRow = {
    nominee_id: string;
    is_finalist: boolean | null;
    nominee: Tables<'staff'>;
  };

  // Aggregate by nominee
  const nomineeMap = new Map<string, NomineeWithCount>();

  (data as NominationRow[]).forEach((nom) => {
    if (!nom.nominee_id || !nom.nominee) return;

    const existing = nomineeMap.get(nom.nominee_id);
    if (existing) {
      existing.nomination_count += 1;
      // If any nomination is finalist, mark as finalist
      if (nom.is_finalist) existing.is_finalist = true;
    } else {
      nomineeMap.set(nom.nominee_id, {
        nominee_id: nom.nominee_id,
        nominee: nom.nominee as Tables<'staff'>,
        nomination_count: 1,
        is_finalist: nom.is_finalist || false,
      });
    }
  });

  // Convert to array and sort by count descending
  return Array.from(nomineeMap.values()).sort(
    (a, b) => b.nomination_count - a.nomination_count
  );
}

/**
 * Mark selected nominees as finalists for a category
 * This updates ALL their nominations in this category to is_finalist = true
 */
export async function markAsFinalists(
  categoryId: string,
  nomineeIds: string[]
): Promise<void> {
  const { error } = await supabase
    .from('nominations')
    .update({ is_finalist: true } as never)
    .eq('category_id', categoryId)
    .in('nominee_id', nomineeIds);

  if (error) throw error;
}

/**
 * Get finalists for a category (for voting page)
 * This directly queries for nominations marked as finalists
 */
export async function getFinalistsByCategory(
  categoryId: string
): Promise<NomineeWithCount[]> {
  const { data, error } = await supabase
    .from('nominations')
    .select(
      `
      nominee_id,
      is_finalist,
      nominee:staff!nominations_nominee_id_fkey(*)
    `
    )
    .eq('category_id', categoryId)
    .eq('is_finalist', true);

  if (error) throw error;

  if (!data || data.length === 0) {
    return [];
  }

  // Define type for query result
  type NominationRow = {
    nominee_id: string;
    is_finalist: boolean | null;
    nominee: Tables<'staff'>;
  };

  // Aggregate by nominee (in case multiple nominations for same person)
  const nomineeMap = new Map<string, NomineeWithCount>();

  (data as NominationRow[]).forEach((nom) => {
    if (!nom.nominee_id || !nom.nominee) return;

    const existing = nomineeMap.get(nom.nominee_id);
    if (existing) {
      existing.nomination_count += 1;
    } else {
      nomineeMap.set(nom.nominee_id, {
        nominee_id: nom.nominee_id,
        nominee: nom.nominee as Tables<'staff'>,
        nomination_count: 1,
        is_finalist: true,
      });
    }
  });

  return Array.from(nomineeMap.values()).sort(
    (a, b) => b.nomination_count - a.nomination_count
  );
}
