'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/supabase/hooks/useAuth';
import LogoutConfirmationModal from '@/components/ui/LogoutConfirmationModal';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = user?.staff?.name || user?.fullName || user?.email || 'User';
  const avatarUrl = user?.staff?.avatar || user?.avatarUrl;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLogoutModalOpen(false);
    }
  };

  return (
    <>
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

            {user ? (
              <div className='relative' ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className='flex items-center gap-2 focus:outline-none'
                  title={userName}>
                  {avatarUrl ? (
                    <div
                      className='bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200 dark:border-gray-700'
                      style={{ backgroundImage: `url(${avatarUrl})` }}></div>
                  ) : (
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-medium'>
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {isDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-card-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='py-1'>
                      <div className='px-4 py-2 border-b border-gray-100 dark:border-gray-700'>
                        <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                          {userName}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className='block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href='/login'
                className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors'>
                Sign In
              </Link>
            )}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden text-text-light-primary dark:text-text-dark-primary cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'>
            <span className='material-symbols-outlined'>
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark absolute top-full left-0 right-0 shadow-lg h-[calc(100vh-64px)] overflow-y-auto'>
            <nav className='flex flex-col p-4 space-y-4'>
              <Link
                href='/'
                className='text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary py-2 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                Home
              </Link>
              <Link
                href='/my-nominations'
                className='text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary py-2 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                My Nominations
              </Link>
              <Link
                href='/results'
                className='text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary py-2 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                Results
              </Link>
              <div className='pt-4 border-t border-gray-100 dark:border-gray-700'>
                {user ? (
                  <div className='space-y-4'>
                    <div className='flex items-center gap-3 px-2'>
                      {avatarUrl ? (
                        <div
                          className='bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200 dark:border-gray-700'
                          style={{
                            backgroundImage: `url(${avatarUrl})`,
                          }}></div>
                      ) : (
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-medium'>
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className='overflow-hidden'>
                        <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                          {userName}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className='w-full text-left px-2 py-2 text-base font-medium text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors'>
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link
                    href='/login'
                    className='block w-full text-center rounded-lg bg-primary px-4 py-3 text-base font-medium text-white hover:bg-primary/90 transition-colors'>
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
