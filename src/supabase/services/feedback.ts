import { supabase } from '../client';

export interface Feedback {
  id: string;
  user_id: string | null;
  user_email: string;
  user_name: string | null;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  created_at: string;
}

export interface CreateFeedbackInput {
  user_email: string;
  user_name?: string;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  message: string;
}

/**
 * Submit feedback from a user
 */
export async function submitFeedback(
  input: CreateFeedbackInput,
  userId?: string
): Promise<Feedback> {
  const { data, error } = await supabase
    .from('feedback')
    .insert({
      user_id: userId || null,
      user_email: input.user_email,
      user_name: input.user_name || null,
      type: input.type,
      message: input.message,
      status: 'new',
    } as never)
    .select()
    .single();

  if (error) throw error;
  return data as Feedback;
}

/**
 * Get all feedback (for admin)
 */
export async function getAllFeedback(): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Feedback[];
}

/**
 * Update feedback status
 */
export async function updateFeedbackStatus(
  feedbackId: string,
  status: 'new' | 'reviewed' | 'resolved'
): Promise<void> {
  const { error } = await supabase
    .from('feedback')
    .update({ status } as never)
    .eq('id', feedbackId);

  if (error) throw error;
}

/**
 * Delete feedback
 */
export async function deleteFeedback(feedbackId: string): Promise<void> {
  const { error } = await supabase
    .from('feedback')
    .delete()
    .eq('id', feedbackId);

  if (error) throw error;
}

/**
 * Get feedback counts by status
 */
export async function getFeedbackCounts(): Promise<{
  new: number;
  reviewed: number;
  resolved: number;
  total: number;
}> {
  const { data, error } = await supabase.from('feedback').select('status');

  if (error) throw error;

  const counts = { new: 0, reviewed: 0, resolved: 0, total: 0 };
  (data || []).forEach((f: { status: string }) => {
    counts.total++;
    if (f.status === 'new') counts.new++;
    else if (f.status === 'reviewed') counts.reviewed++;
    else if (f.status === 'resolved') counts.resolved++;
  });

  return counts;
}
