import { supabase } from '../client';
import { Database } from '../types';

type Admin = Database['public']['Tables']['admins']['Row'];

const ADMIN_SESSION_KEY = 'admin_session_token';

interface AdminSession {
  id: string;
  email: string;
  session_version: number;
  timestamp: number;
}

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

    const data = rawData as Admin & { session_version?: number };

    // Simple password check (plaintext as requested/implied by "predefined password table")
    // In production, use bcrypt/argon2
    if (data.password === password) {
      // Store session with version for invalidation support
      if (typeof window !== 'undefined') {
        const session: AdminSession = {
          id: data.id,
          email: data.email,
          session_version: data.session_version || 1,
          timestamp: Date.now(),
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
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

export function getAdminSession(): AdminSession | null {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (session) {
      try {
        return JSON.parse(session) as AdminSession;
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
}

/**
 * Validates the admin session against the database.
 * Returns true if session is valid, false if invalid (credentials changed).
 * This should be called periodically to check for session invalidation.
 */
export async function validateAdminSession(): Promise<boolean> {
  const session = getAdminSession();
  if (!session) return false;

  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id, session_version')
      .eq('id', session.id)
      .single();

    if (error || !data) {
      // Admin no longer exists
      signOutAdmin();
      return false;
    }

    const dbData = data as { id: string; session_version?: number };
    const dbVersion = dbData.session_version || 1;

    // If session version doesn't match, credentials have changed
    if (session.session_version !== dbVersion) {
      signOutAdmin();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

export async function updateAdminPassword(
  adminId: string,
  newPassword: string
): Promise<boolean> {
  try {
    // Get current session_version
    const { data: adminData } = await supabase
      .from('admins')
      .select('session_version')
      .eq('id', adminId)
      .single();

    const currentVersion = adminData
      ? (adminData as { session_version?: number }).session_version || 1
      : 1;

    // Update password AND increment session_version to invalidate all existing sessions
    const { error } = await (supabase.from('admins') as any)
      .update({
        password: newPassword,
        session_version: currentVersion + 1,
      })
      .eq('id', adminId);

    if (error) {
      console.error('Error updating password:', error);
      return false;
    }

    // Update the current session to the new version so they stay logged in
    const session = getAdminSession();
    if (session && session.id === adminId && typeof window !== 'undefined') {
      session.session_version = currentVersion + 1;
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    }

    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    return false;
  }
}
