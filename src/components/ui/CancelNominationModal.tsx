interface CancelNominationModalProps {
  isOpen: boolean;
  nominationId: string;
  nomineeName: string;
  onConfirm: (id: string) => void;
  onCancel: () => void;
}

export default function CancelNominationModal({
  isOpen,
  nominationId,
  nomineeName,
  onConfirm,
  onCancel,
}: CancelNominationModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md'>
        <div className='p-6'>
          <div className='flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4'>
            <span className='material-symbols-outlined text-4xl text-red-600 dark:text-red-400'>
              warning
            </span>
          </div>

          <h3 className='text-xl font-bold text-[#212529] dark:text-white text-center mb-2'>
            Cancel Nomination?
          </h3>

          <p className='text-[#6c757d] dark:text-gray-400 text-center mb-6'>
            Are you sure you want to cancel your nomination for{' '}
            <span className='font-semibold text-[#212529] dark:text-white'>
              {nomineeName}
            </span>
            ? This action cannot be undone.
          </p>

          <div className='flex gap-3'>
            <button
              onClick={onCancel}
              className='flex-1 px-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-[#6c757d] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors cursor-pointer'>
              Keep Nomination
            </button>
            <button
              onClick={() => onConfirm(nominationId)}
              className='flex-1 px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors cursor-pointer'>
              Yes, Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
