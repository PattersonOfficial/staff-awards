import { supabase } from '../client';
import type { Tables, InsertTables, UpdateTables } from '../types';

export type NominationRow = Tables<'nominations'>;
export type NominationInsert = InsertTables<'nominations'>;
export type NominationUpdate = UpdateTables<'nominations'>;

// Full nomination with joined data
export interface NominationWithDetails extends NominationRow {
  nominee: Tables<'staff'>;
  nominator: Tables<'staff'>;
  category: Tables<'categories'>;
}

export async function getNominations(): Promise<NominationWithDetails[]> {
  const { data, error } = await supabase
    .from('nominations')
    .select(
      `
      *,
      nominee:staff!nominations_nominee_id_fkey(*),
      nominator:staff!nominations_nominator_id_fkey(*),
      category:categories(*)
    `
    )
    .order('submitted_at', { ascending: false });

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
      nominator:staff!nominations_nominator_id_fkey(*),
      category:categories(*)
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
      nominator:staff!nominations_nominator_id_fkey(*),
      category:categories(*)
    `
    )
    .eq('category_id', categoryId)
    .order('submitted_at', { ascending: false });

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
      nominator:staff!nominations_nominator_id_fkey(*),
      category:categories(*)
    `
    )
    .eq('nominator_id', nominatorId)
    .order('submitted_at', { ascending: false });

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
      nominator:staff!nominations_nominator_id_fkey(*),
      category:categories(*)
    `
    )
    .eq('status', 'pending')
    .order('submitted_at', { ascending: false });

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
      nominator:staff!nominations_nominator_id_fkey(*),
      category:categories(*)
    `
    )
    .eq('status', 'shortlisted');

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query.order('submitted_at', {
    ascending: false,
  });

  if (error) throw error;
  return data as unknown as NominationWithDetails[];
}

export async function createNomination(
  nomination: NominationInsert
): Promise<NominationRow> {
  const { data, error } = await supabase
    .from('nominations')
    .insert(nomination as never)
    .select()
    .single();

  if (error) throw error;
  return data as NominationRow;
}

export async function updateNominationStatus(
  id: string,
  status: NominationRow['status']
): Promise<NominationRow> {
  const { data, error } = await supabase
    .from('nominations')
    .update({ status, updated_at: new Date().toISOString() } as never)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as NominationRow;
}

export async function approveNomination(id: string): Promise<NominationRow> {
  return updateNominationStatus(id, 'approved');
}

export async function rejectNomination(id: string): Promise<NominationRow> {
  return updateNominationStatus(id, 'rejected');
}

export async function shortlistNomination(id: string): Promise<NominationRow> {
  return updateNominationStatus(id, 'shortlisted');
}

export async function deleteNomination(id: string): Promise<void> {
  const { error } = await supabase.from('nominations').delete().eq('id', id);

  if (error) throw error;
}

// Get nomination counts by category (for dashboard)
export async function getNominationCounts() {
  const { data, error } = await supabase
    .from('nominations')
    .select('category_id, status');

  if (error) throw error;

  const nominations = data as { category_id: string; status: string }[];

  return {
    total: nominations.length,
    pending: nominations.filter((n) => n.status === 'pending').length,
    approved: nominations.filter((n) => n.status === 'approved').length,
    rejected: nominations.filter((n) => n.status === 'rejected').length,
    shortlisted: nominations.filter((n) => n.status === 'shortlisted').length,
  };
}
