'use client';

import { useState } from 'react';
import {
  submitFeedback,
  CreateFeedbackInput,
} from '@/supabase/services/feedback';
import { useAuth } from '@/supabase/hooks/useAuth';
import { useToast } from '@/context/ToastContext';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [type, setType] = useState<CreateFeedbackInput['type']>('other');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback(
        {
          user_email: user?.email || 'anonymous@user.com',
          user_name: user?.staff?.name || user?.fullName || undefined,
          type,
          message: message.trim(),
        },
        user?.id
      );

      toast.success('Thank you for your feedback!');
      setMessage('');
      setType('other');
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
              <span className='material-symbols-outlined text-primary'>
                feedback
              </span>
            </div>
            <div>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Send Feedback
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Help us improve the awards system
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 pb-0! cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700'>
            <span className='material-symbols-outlined'>close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-4 space-y-4'>
          {/* Type Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Type of Feedback
            </label>
            <div className='grid grid-cols-2 gap-2'>
              {[
                { value: 'bug', label: 'Bug Report', icon: 'bug_report' },
                {
                  value: 'feature',
                  label: 'Feature Request',
                  icon: 'lightbulb',
                },
                {
                  value: 'improvement',
                  label: 'Improvement',
                  icon: 'trending_up',
                },
                { value: 'other', label: 'Other', icon: 'chat' },
              ].map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() =>
                    setType(option.value as CreateFeedbackInput['type'])
                  }
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    type === option.value
                      ? 'border-primary bg-primary text-white font-semibold shadow-md'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}>
                  <span
                    className={`material-symbols-outlined text-xl ${
                      type === option.value ? 'text-white' : ''
                    }`}>
                    {option.icon}
                  </span>
                  <span className='text-sm font-medium'>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Your Feedback
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Tell us what you think, report a bug, or suggest an improvement...'
              rows={4}
              className='w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent resize-none'
              required
            />
          </div>

          {/* Actions */}
          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
              Cancel
            </button>
            <button
              type='submit'
              disabled={submitting || !message.trim()}
              className='flex-1 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2'>
              {submitting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Sending...
                </>
              ) : (
                <>
                  <span className='material-symbols-outlined text-lg'>
                    send
                  </span>
                  Send Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
