import { Staff } from '@/types';

interface StaffCardProps {
  staff: Staff;
  selected?: boolean;
  onClick?: () => void;
}

export default function StaffCard({ staff, selected = false, onClick }: StaffCardProps) {
  return (
    <div
      className={`flex flex-col items-center p-6 rounded-xl shadow-sm cursor-pointer transition-all duration-200 ${
        selected
          ? 'bg-white dark:bg-slate-800 border-2 border-primary ring-4 ring-primary/20 dark:ring-primary/30'
          : 'bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary'
      }`}
      onClick={onClick}
    >
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 mb-4"
        style={{ backgroundImage: `url(${staff.avatar})` }}
      />
      <h4 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight text-center">
        {staff.name}
      </h4>
      <p className="text-slate-600 dark:text-slate-400 text-sm font-normal text-center">
        {staff.position}
      </p>
      <p className="text-slate-500 dark:text-slate-500 text-xs font-normal text-center mt-1">
        {staff.department}
      </p>
    </div>
  );
}
