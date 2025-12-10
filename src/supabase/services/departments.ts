import { supabase } from '../client';
import { Database } from '../types';

export type Department = Database['public']['Tables']['departments']['Row'];
export type DepartmentInsert =
  Database['public']['Tables']['departments']['Insert'];
export type DepartmentUpdate =
  Database['public']['Tables']['departments']['Update'];

export async function getDepartments() {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
  return data;
}

export async function createDepartment(department: DepartmentInsert) {
  const { data, error } = await supabase
    .from('departments')
    .insert(department as any)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDepartment(id: string) {
  const { error } = await supabase.from('departments').delete().eq('id', id);
  if (error) throw error;
}
