import { supabase } from '../client';
import type { Tables, InsertTables, UpdateTables } from '../types';

export type Category = Tables<'categories'>;
export type CategoryInsert = InsertTables<'categories'>;
export type CategoryUpdate = UpdateTables<'categories'>;

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Category[];
}

export async function getCategoryById(id: string): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Category;
}

export async function getPublishedCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('status', 'published')
    .order('nomination_deadline', { ascending: true });

  if (error) throw error;
  return data as Category[];
}

export async function createCategory(
  category: CategoryInsert
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert(category as never)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function updateCategory(
  id: string,
  updates: CategoryUpdate
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update({ ...updates, updated_at: new Date().toISOString() } as never)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) throw error;
}

export async function publishCategory(id: string): Promise<Category> {
  return updateCategory(id, { status: 'published' });
}

export async function closeCategory(id: string): Promise<Category> {
  return updateCategory(id, { status: 'closed' });
}

// Publish winner for a category
export async function publishWinner(
  categoryId: string,
  winnerId: string
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update({
      winner_id: winnerId,
      winner_published_at: new Date().toISOString(),
      status: 'closed', // Close voting when winner is published
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', categoryId)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

// Get categories that have winners published
export async function getCategoriesWithWinners(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .not('winner_id', 'is', null)
    .order('winner_published_at', { ascending: false });

  if (error) throw error;
  return data as Category[];
}

// Remove winner from a category (unpublish)
export async function unpublishWinner(categoryId: string): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update({
      winner_id: null,
      winner_published_at: null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', categoryId)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}
