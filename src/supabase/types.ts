// Database types for Supabase
// Run `npx supabase gen types typescript --project-id <project-id>` to generate these types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          email: string;
          password: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      staff: {
        Row: {
          id: string;
          name: string;
          email: string;
          department: string | null;
          position: string | null;
          avatar: string | null;
          role: string; // 'staff' | 'admin'
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          department?: string | null;
          position?: string | null;
          avatar?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          department?: string | null;
          position?: string | null;
          avatar?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image: string | null;
          type: string;
          department: string | null;
          quantity: number;
          nomination_start: string | null;
          nomination_end: string | null;
          voting_start: string | null;
          voting_end: string | null;
          nomination_deadline: string | null; // Legacy/Compat
          status: 'draft' | 'published' | 'closed' | string;
          shortlisting_start: string | null;
          shortlisting_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image?: string | null;
          type?: string;
          department?: string | null;
          quantity?: number;
          nomination_start?: string | null;
          nomination_end?: string | null;
          voting_start?: string | null;
          voting_end?: string | null;
          nomination_deadline?: string | null;
          status?: 'draft' | 'published' | 'closed' | string;
          shortlisting_start?: string | null;
          shortlisting_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image?: string | null;
          type?: string;
          department?: string | null;
          quantity?: number;
          nomination_start?: string | null;
          nomination_end?: string | null;
          voting_start?: string | null;
          voting_end?: string | null;
          nomination_deadline?: string | null;
          status?: 'draft' | 'published' | 'closed' | string;
          shortlisting_start?: string | null;
          shortlisting_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      nominations: {
        Row: {
          id: string;
          category_id: string;
          nominator_id: string | null;
          nominator_email?: string | null; // Added manually
          nominee_id: string;
          reason: string | null;
          status: 'pending' | 'approved' | 'rejected' | 'shortlisted' | string;
          submitted_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          nominator_id?: string | null;
          nominator_email?: string | null; // Added manually
          nominee_id: string;
          reason?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'shortlisted' | string;
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          nominator_id?: string | null;
          nominee_id?: string;
          reason?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'shortlisted' | string;
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          category_id: string;
          voter_id: string | null;
          nominee_id: string;
          voted_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          voter_id?: string | null;
          nominee_id: string;
          voted_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          voter_id?: string | null;
          nominee_id?: string;
          voted_at?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
