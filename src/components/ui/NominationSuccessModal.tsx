import { Staff, AwardCategory } from '@/types';
import { useRouter } from 'next/navigation';

interface NominationSuccessModalProps {
  isOpen: boolean;
  staff: Staff | null;
  category: AwardCategory;
  onClose: () => void;
}

export default function NominationSuccessModal({
  isOpen,
  staff,
  category,
  onClose,
}: NominationSuccessModalProps) {
  const router = useRouter();

  if (!isOpen || !staff) return null;

  const handleViewNominations = () => {
    router.push('/my-nominations');
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
      <div className='flex flex-col items-center gap-6 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md'>
        <div className='flex items-center justify-center size-16 rounded-full bg-green-100 dark:bg-green-900/50'>
          <span className='material-symbols-outlined text-4xl text-green-500 dark:text-green-400'>
            check_circle
          </span>
        </div>
        <div className='text-center'>
          <h3 className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
            Nomination Successful!
          </h3>
          <p className='mt-2 text-slate-600 dark:text-slate-400'>
            You have successfully nominated{' '}
            <span className='font-semibold text-slate-800 dark:text-slate-200'>
              {staff.name}
            </span>{' '}
            for the {category.title}.
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-3 w-full'>
          <button
            onClick={onClose}
            className='flex-1 flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer'>
            Close
          </button>
          <button
            onClick={handleViewNominations}
            className='flex-1 flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors cursor-pointer'>
            View My Nominations
          </button>
        </div>
      </div>
    </div>
  );
}
