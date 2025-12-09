import { supabase } from '../client';
import { Database } from '../types';

type Admin = Database['public']['Tables']['admins']['Row'];

// In a real app, this should be a robust session management.
// For this MVP request, we'll simple check the DB and maybe store a specialized token in localStorage
// or just rely on a client-side state for the single session.
// However, since Next.js is full stack, we should ideally use cookies.
// Given the constraints and requested simplicity ("login with table"), we'll use a simple localStorage approach for client-side protection
// and just verify credentials against the DB.

const ADMIN_SESSION_KEY = 'admin_session_token';

export async function signInAdmin(
  email: string,
  password: string
): Promise<boolean> {
  try {
    const { data: rawData, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !rawData) {
      console.error('Error fetching admin:', error);
      return false;
    }

    const data = rawData as Admin;

    // Simple password check (plaintext as requested/implied by "predefined password table")
    // In production, use bcrypt/argon2
    if (data.password === password) {
      // Create a dummy session token (in real app, use JWT)
      // For now, we store the admin ID as proof
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          ADMIN_SESSION_KEY,
          JSON.stringify({
            id: data.id,
            email: data.email,
            timestamp: Date.now(),
          })
        );
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

export function signOutAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

export function getAdminSession() {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (session) {
      try {
        return JSON.parse(session);
      } catch (error) {
        // invalid JSON
        return null;
      }
    }
  }
  return null;
}

export function isAuthenticatedAdmin(): boolean {
  return !!getAdminSession();

export async function updateAdminPassword(adminId: string, newPassword: string): Promise<boolean> {
  const { error } = await supabase
    .from('admins')
    .update({ password: newPassword as any }) // Type cast might be needed if types.ts is strict about password column 
    .eq('id', adminId);

  if (error) {
    console.error('Error updating password:', error);
    return false;
  }
  return true;
}
