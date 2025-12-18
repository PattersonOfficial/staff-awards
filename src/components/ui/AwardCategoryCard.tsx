import { AwardCategory } from '@/types';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface AwardCategoryCardProps {
  category: AwardCategory;
}

type Phase = 'nominations' | 'voting' | 'closed' | 'upcoming';

function getCategoryPhase(category: AwardCategory): Phase {
  const now = new Date();
  const nominationDeadline = new Date(category.nominationDeadline);
  const votingStart = category.votingStart
    ? new Date(category.votingStart)
    : null;
  const votingEnd = category.votingEnd ? new Date(category.votingEnd) : null;

  // Check if nominations are still open (inclusive of deadline datetime)
  if (now <= nominationDeadline) {
    return 'nominations';
  }

  // Check if voting is open (inclusive of voting end datetime)
  if (votingStart && votingEnd && now >= votingStart && now <= votingEnd) {
    return 'voting';
  }

  // Check if voting hasn't started yet (between nomination deadline and voting start)
  if (votingStart && now < votingStart) {
    return 'upcoming';
  }

  // Voting has ended or no voting dates set
  return 'closed';
}

export default function AwardCategoryCard({
  category,
}: AwardCategoryCardProps) {
  const phase = getCategoryPhase(category);

  const getButtonConfig = () => {
    switch (phase) {
      case 'nominations':
        return {
          text: 'Nominate Now',
          href: `/categories/${category.id}`,
          enabled: true,
          className: 'bg-primary hover:opacity-90',
        };
      case 'voting':
        return {
          text: 'Vote Now',
          href: `/categories/${category.id}`,
          enabled: true,
          className: 'bg-green-600 hover:bg-green-700',
        };
      case 'upcoming':
        return {
          text: 'Voting Coming Soon',
          href: '#',
          enabled: false,
          className: 'bg-yellow-600 cursor-not-allowed opacity-75',
        };
      case 'closed':
        return {
          text: 'Closed',
          href: '#',
          enabled: false,
          className: 'bg-gray-500 cursor-not-allowed opacity-75',
        };
    }
  };

  const getStatusBadge = () => {
    switch (phase) {
      case 'nominations':
        return (
          <div className='flex items-center text-xs text-[#6c757d] dark:text-text-dark-secondary'>
            <span className='material-symbols-outlined mr-1.5 text-sm'>
              calendar_today
            </span>
            Nominations close: {formatDate(category.nominationDeadline)}
          </div>
        );
      case 'voting':
        return (
          <div className='flex items-center text-xs text-green-600 dark:text-green-400'>
            <span className='material-symbols-outlined mr-1.5 text-sm'>
              how_to_vote
            </span>
            Voting open until:{' '}
            {category.votingEnd ? formatDate(category.votingEnd) : 'TBD'}
          </div>
        );
      case 'upcoming':
        return (
          <div className='flex items-center text-xs text-yellow-600 dark:text-yellow-400'>
            <span className='material-symbols-outlined mr-1.5 text-sm'>
              schedule
            </span>
            Voting starts:{' '}
            {category.votingStart ? formatDate(category.votingStart) : 'TBD'}
          </div>
        );
      case 'closed':
        return (
          <div className='flex items-center text-xs text-gray-500'>
            <span className='material-symbols-outlined mr-1.5 text-sm'>
              check_circle
            </span>
            Award cycle complete
          </div>
        );
    }
  };

  const buttonConfig = getButtonConfig();

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
        {getStatusBadge()}
        {buttonConfig.enabled ? (
          <Link
            href={buttonConfig.href}
            className={`mt-5 w-full rounded-lg py-2.5 text-sm font-semibold text-white text-center transition-colors ${buttonConfig.className}`}>
            {buttonConfig.text}
          </Link>
        ) : (
          <span
            className={`mt-5 w-full rounded-lg py-2.5 text-sm font-semibold text-white text-center ${buttonConfig.className}`}>
            {buttonConfig.text}
          </span>
        )}
      </div>
    </div>
  );
}
