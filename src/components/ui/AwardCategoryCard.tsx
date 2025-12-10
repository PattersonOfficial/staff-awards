import { AwardCategory } from '@/types';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface AwardCategoryCardProps {
  category: AwardCategory;
}

export default function AwardCategoryCard({
  category,
}: AwardCategoryCardProps) {
  return (
    <div className='group flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1'>
      <div
        className='w-full h-40 bg-center bg-no-repeat bg-cover'
        style={{ backgroundImage: `url(${category.image})` }}
      />
      <div className='flex flex-1 flex-col p-5'>
        <h3 className='text-lg font-bold text-[#212529] dark:text-text-dark-primary'>
          {category.title}
        </h3>
        <p className='mt-1 grow text-sm text-[#6c757d] dark:text-text-dark-secondary'>
          {category.description}
        </p>
        <div className='my-4 flex flex-wrap gap-2'>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              category.type === 'Individual Award'
                ? 'bg-primary-accent/10 text-primary-accent'
                : 'bg-green-500/10 text-green-600 dark:text-green-400'
            }`}>
            {category.type}
          </span>
          {category.department && (
            <span className='rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-400'>
              {category.department}
            </span>
          )}
        </div>
        <div className='flex items-center text-xs text-[#6c757d] dark:text-text-dark-secondary'>
          <span className='material-symbols-outlined mr-1.5 text-sm'>
            calendar_today
          </span>
          Nominations close: {formatDate(category.nominationDeadline)}
        </div>
        <Link
          href={`/categories/${category.id}`}
          className='mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white text-center transition-colors hover:opacity-90'>
          Nominate Now
        </Link>
      </div>
    </div>
  );
}
