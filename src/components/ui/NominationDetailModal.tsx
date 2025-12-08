import { Nomination } from '@/types';

interface NominationDetailModalProps {
  nomination: Nomination | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NominationDetailModal({
  nomination,
  isOpen,
  onClose,
}: NominationDetailModalProps) {
  if (!isOpen || !nomination) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <div className='sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-[#212529] dark:text-white'>
            Nomination Details
          </h2>
          <button
            onClick={onClose}
            className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
            <span className='material-symbols-outlined text-gray-500 dark:text-gray-400'>
              close
            </span>
          </button>
        </div>

        <div className='p-6 space-y-6'>
          <div className='flex items-start gap-4 pb-6 border-b border-gray-200 dark:border-gray-700'>
            <div
              className='w-20 h-20 rounded-full bg-cover bg-center shrink-0'
              style={{ backgroundImage: `url(${nomination.nominee.avatar})` }}
            />
            <div className='flex-1'>
              <h3 className='text-xl font-bold text-[#212529] dark:text-white mb-1'>
                {nomination.nominee.name}
              </h3>
              <p className='text-[#6c757d] dark:text-gray-400 mb-2'>
                {nomination.nominee.position}
              </p>
              <div className='flex items-center gap-2 text-sm text-[#6c757d] dark:text-gray-400'>
                <span className='material-symbols-outlined text-sm'>
                  business
                </span>
                {nomination.nominee.department}
              </div>
              <div className='flex items-center gap-2 text-sm text-[#6c757d] dark:text-gray-400 mt-1'>
                <span className='material-symbols-outlined text-sm'>email</span>
                {nomination.nominee.email}
              </div>
            </div>
          </div>

          <div>
            <h4 className='text-sm font-semibold text-[#212529] dark:text-white mb-2 flex items-center gap-2'>
              <span className='material-symbols-outlined text-[#0A4D68]'>
                workspace_premium
              </span>
              Award Category
            </h4>
            <div className='bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4'>
              <p className='font-semibold text-[#212529] dark:text-white mb-1'>
                {nomination.category.title}
              </p>
              <p className='text-sm text-[#6c757d] dark:text-gray-400'>
                {nomination.category.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className='text-sm font-semibold text-[#212529] dark:text-white mb-2 flex items-center gap-2'>
              <span className='material-symbols-outlined text-[#0A4D68]'>
                description
              </span>
              Reason for Nomination
            </h4>
            <div className='bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4'>
              <p className='text-[#212529] dark:text-gray-300 leading-relaxed'>
                {nomination.reason}
              </p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-sm font-semibold text-[#212529] dark:text-white mb-2 flex items-center gap-2'>
                <span className='material-symbols-outlined text-[#0A4D68]'>
                  person
                </span>
                Nominated By
              </h4>
              <div className='bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4'>
                <p className='font-medium text-[#212529] dark:text-white'>
                  {nomination.nominator.name}
                </p>
                <p className='text-sm text-[#6c757d] dark:text-gray-400'>
                  {nomination.nominator.position}
                </p>
              </div>
            </div>

            <div>
              <h4 className='text-sm font-semibold text-[#212529] dark:text-white mb-2 flex items-center gap-2'>
                <span className='material-symbols-outlined text-[#0A4D68]'>
                  schedule
                </span>
                Submission Date
              </h4>
              <div className='bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4'>
                <p className='font-medium text-[#212529] dark:text-white'>
                  {new Date(nomination.submittedAt).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </p>
                <p className='text-sm text-[#6c757d] dark:text-gray-400'>
                  {new Date(nomination.submittedAt).toLocaleTimeString(
                    'en-US',
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className='text-sm font-semibold text-[#212529] dark:text-white mb-2 flex items-center gap-2'>
              <span className='material-symbols-outlined text-[#0A4D68]'>
                info
              </span>
              Status
            </h4>
            <div className='bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4'>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                  nomination.status === 'pending'
                    ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
                    : nomination.status === 'approved'
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                    : nomination.status === 'rejected'
                    ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                    : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                }`}>
                {nomination.status.charAt(0).toUpperCase() +
                  nomination.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className='sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3 justify-end'>
          <button
            onClick={onClose}
            className='px-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-[#6c757d] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors'>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
