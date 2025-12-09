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
      staff: {
        Row: {
          id: string;
          name: string;
          email: string;
          position: string;
          department: string;
          avatar: string | null;
          role: 'staff' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          position: string;
          department: string;
          avatar?: string | null;
          role?: 'staff' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          position?: string;
          department?: string;
          avatar?: string | null;
          role?: 'staff' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
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
      categories: {
        Row: {
          id: string;
          title: string;
          description: string;
          image: string | null;
          type: 'Individual Award' | 'Team Award';
          department: string | null;
          nomination_deadline: string;
          status: 'draft' | 'published' | 'closed';
          shortlisting_start: string | null;
          shortlisting_end: string | null;
          voting_start: string | null;
          voting_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image?: string | null;
          type: 'Individual Award' | 'Team Award';
          department?: string | null;
          nomination_deadline: string;
          status?: 'draft' | 'published' | 'closed';
          shortlisting_start?: string | null;
          shortlisting_end?: string | null;
          voting_start?: string | null;
          voting_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image?: string | null;
          type?: 'Individual Award' | 'Team Award';
          department?: string | null;
          nomination_deadline?: string;
          status?: 'draft' | 'published' | 'closed';
          shortlisting_start?: string | null;
          shortlisting_end?: string | null;
          voting_start?: string | null;
          voting_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      nominations: {
        Row: {
          id: string;
          nominee_id: string;
          nominator_id: string;
          category_id: string;
          reason: string;
          status: 'pending' | 'approved' | 'rejected' | 'shortlisted';
          submitted_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nominee_id: string;
          nominator_id: string;
          category_id: string;
          reason: string;
          status?: 'pending' | 'approved' | 'rejected' | 'shortlisted';
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nominee_id?: string;
          nominator_id?: string;
          category_id?: string;
          reason?: string;
          status?: 'pending' | 'approved' | 'rejected' | 'shortlisted';
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          voter_id: string;
          category_id: string;
          nominee_id: string;
          voted_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          voter_id: string;
          category_id: string;
          nominee_id: string;
          voted_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          voter_id?: string;
          category_id?: string;
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
