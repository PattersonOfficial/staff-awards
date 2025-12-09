import { Staff, AwardCategory } from '@/types';
import { useState } from 'react';

interface NominationFormModalProps {
  isOpen: boolean;
  staff: Staff | null;
  category: AwardCategory | null;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function NominationFormModal({
  isOpen,
  staff,
  category,
  onClose,
  onSubmit,
}: NominationFormModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen || !staff || !category) return null;

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason('');
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
      <div className='bg-white dark:bg-gray-800 w-full max-w-lg m-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto'>
        <div className='p-6 flex flex-col gap-4'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20'>
                <span className='material-symbols-outlined text-primary dark:text-blue-300'>
                  workspace_premium
                </span>
              </div>
              <div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                  Confirm Nomination
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  {category.title}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer'>
              <span className='material-symbols-outlined'>close</span>
            </button>
          </div>

          <div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg'>
            <div
              className='w-16 h-16 rounded-full bg-cover bg-center shrink-0'
              style={{ backgroundImage: `url(${staff.avatar})` }}
            />
            <div className='flex-1 min-w-0'>
              <h4 className='text-lg font-bold text-gray-900 dark:text-white'>
                {staff.name}
              </h4>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {staff.position}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-500'>
                {staff.department}
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <label
              htmlFor='nomination-reason'
              className='text-sm font-semibold text-gray-900 dark:text-white'>
              Reason for Nomination <span className='text-red-500'>*</span>
            </label>
            <textarea
              id='nomination-reason'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder='Please provide a detailed reason why this staff member deserves this award...'
              rows={6}
              className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-sm'
            />
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Minimum 20 characters required ({reason.length}/20)
            </p>
          </div>
        </div>

        <div className='border-t border-gray-200 dark:border-gray-700 p-6 flex flex-col-reverse sm:flex-row gap-3'>
          <button
            onClick={handleClose}
            className='flex-1 inline-flex justify-center rounded-lg bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer'>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={reason.trim().length < 20}
            className='flex-1 inline-flex justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer'>
            Submit Nomination
          </button>
        </div>
      </div>
    </div>
  );
}
