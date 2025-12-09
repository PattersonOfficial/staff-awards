import { supabase } from '../client';
import type { Tables, InsertTables, UpdateTables } from '../types';

export type StaffMember = Tables<'staff'>;
export type StaffInsert = InsertTables<'staff'>;
export type StaffUpdate = UpdateTables<'staff'>;

export async function getStaff(): Promise<StaffMember[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data as StaffMember[];
}

export async function getStaffById(id: string): Promise<StaffMember> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as StaffMember;
}

export async function getStaffByEmail(email: string): Promise<StaffMember> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('email', email)
    .single();

  if (error) throw error;
  return data as StaffMember;
}

export async function getStaffByDepartment(
  department: string
): Promise<StaffMember[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('department', department)
    .order('name', { ascending: true });

  if (error) throw error;
  return data as StaffMember[];
}

export async function getAdmins(): Promise<StaffMember[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('role', 'admin')
    .order('name', { ascending: true });

  if (error) throw error;
  return data as StaffMember[];
}

export async function createStaff(staff: StaffInsert): Promise<StaffMember> {
  const { data, error } = await supabase
    .from('staff')
    .insert(staff as never)
    .select()
    .single();

  if (error) throw error;
  return data as StaffMember;
}

export async function updateStaff(
  id: string,
  updates: StaffUpdate
): Promise<StaffMember> {
  const { data, error } = await supabase
    .from('staff')
    .update({ ...updates, updated_at: new Date().toISOString() } as never)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as StaffMember;
}

export async function deleteStaff(id: string): Promise<void> {
  const { error } = await supabase.from('staff').delete().eq('id', id);

  if (error) throw error;
}

export async function setStaffRole(
  id: string,
  role: 'staff' | 'admin'
): Promise<StaffMember> {
  return updateStaff(id, { role });
}

// Get all unique departments
export async function getDepartments(): Promise<string[]> {
  const { data, error } = await supabase.from('staff').select('department');

  if (error) throw error;

  const staffData = data as { department: string }[];
  const departments = [...new Set(staffData.map((s) => s.department))];
  return departments.sort();
}

// Search staff by name or email
export async function searchStaff(query: string): Promise<StaffMember[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('name', { ascending: true })
    .limit(10);

  if (error) throw error;
  return data as StaffMember[];
}
