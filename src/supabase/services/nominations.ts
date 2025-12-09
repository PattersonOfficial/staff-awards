import { supabase } from '../client';
import type { Tables, InsertTables, UpdateTables } from '../types';

export type Nomination = Tables<'nominations'>;
export type NominationInsert = InsertTables<'nominations'>;
export type NominationUpdate = UpdateTables<'nominations'>;

export type NominationWithDetails = Nomination & {
  nominee: Tables<'staff'>;
  nominator: Tables<'staff'> | null;
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
      nominator:staff!nominations_nominator_id_fkey(*),
      category:categories!nominations_category_id_fkey(*)
    `
    )
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as unknown as NominationWithDetails[];
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
      category:categories!nominations_category_id_fkey(*)
    `
    )
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false });

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
