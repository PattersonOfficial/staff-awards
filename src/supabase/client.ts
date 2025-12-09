import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create the client - during development without env vars, this creates a non-functional client
// that won't fail at build time but will fail at runtime if env vars are missing
let supabase: SupabaseClient<Database>;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
    },
  });
} else {
  // Create a placeholder client for build purposes
  // This will throw errors at runtime if actually used without proper env vars
  supabase = createClient<Database>(
    'https://placeholder.supabase.co',
    'placeholder-key'
  );
}

export { supabase };

// Server-side client (for use in Server Components and API routes)
export const createServerClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
};

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};
