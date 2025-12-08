import Link from 'next/link';

export default function Header() {
  return (
    <header className='sticky top-0 z-50 flex items-center justify-center border-b border-gray-200/50 dark:border-gray-700/50 bg-[#F8F9FA]/80 dark:bg-background-dark/80 backdrop-blur-sm'>
      <div className='flex w-full max-w-7xl items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-8 py-3'>
        <div className='flex items-center gap-4'>
          <div className='size-6 text-primary'>
            <svg
              fill='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'>
              <path d='M12 2L1 9l4 2.18v6.32L12 22l7-4.5V11.18L23 9 12 2zm0 2.31L19.59 9 12 12.55 4.41 9 12 4.31zM7 12.23v4.32l-2-.98V11.25l2 .98zM12 14.87l5-2.5v4.32l-5 2.5v-4.32zm-5 1.54l5 2.5v-4.32l-5-2.5v4.32z'></path>
            </svg>
          </div>
          <h2 className='text-lg font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary'>
            Company Awards
          </h2>
        </div>
        <div className='hidden md:flex flex-1 items-center justify-end gap-8'>
          <nav className='flex items-center gap-6'>
            <Link
              href='/'
              className='text-sm font-medium text-[#6c757d] dark:text-text-dark-secondary hover:text-[#007BFF]'>
              Home
            </Link>
            <Link
              href='/my-nominations'
              className='text-sm font-medium text-[#6c757d] dark:text-text-dark-secondary hover:text-[#007BFF]'>
              My Nominations
            </Link>
            <Link
              href='/results'
              className='text-sm font-medium text-[#6c757d] dark:text-text-dark-secondary hover:text-[#007BFF]'>
              Results
            </Link>
          </nav>
          <div className='bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-200 dark:bg-gray-700'></div>
        </div>
        <button className='md:hidden text-text-light-primary dark:text-text-dark-primary'>
          <span className='material-symbols-outlined'>menu</span>
        </button>
      </div>
    </header>
  );
}
