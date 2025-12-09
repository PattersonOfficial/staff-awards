import { supabase } from '../client';
import type { Tables } from '../types';

export type AuthUser = {
  id: string;
  email: string;
  staff?: Tables<'staff'>;
};

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Sign up with email and password
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current session
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// Get current user
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

// Get current user with staff profile
export async function getCurrentUserWithProfile(): Promise<AuthUser | null> {
  const user = await getCurrentUser();
  if (!user || !user.email) return null;

  const { data: staff } = await supabase
    .from('staff')
    .select('*')
    .eq('email', user.email)
    .single();

  return {
    id: user.id,
    email: user.email,
    staff: staff || undefined,
  };
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const userWithProfile = await getCurrentUserWithProfile();
  return userWithProfile?.staff?.role === 'admin';
}

// Password reset
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
}

// Update password
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}

// Listen to auth state changes
export function onAuthStateChange(
  callback: (event: string, session: unknown) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

// Magic link sign in (passwordless)
export async function signInWithMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
}

// OAuth sign in (e.g., Google, Microsoft)
export async function signInWithOAuth(provider: 'google' | 'azure') {
  const options: { redirectTo: string; queryParams?: { [key: string]: string } } = {
    redirectTo: `${window.location.origin}/auth/callback`,
  };

  // Restrict Google sign-in to specific domain
  if (provider === 'google') {
    options.queryParams = {
      hd: 'devopsafricalimited.com',
      prompt: 'select_account',
    };
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options,
  });

  if (error) throw error;
}
