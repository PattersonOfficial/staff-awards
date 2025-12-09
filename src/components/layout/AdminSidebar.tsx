'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/supabase/hooks/useAuth';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getLinkClass = (path: string) => {
    const active = isActive(path);
    const baseClass =
      'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors';
    const activeClass = 'bg-accent-light dark:bg-accent-dark text-primary';
    const inactiveClass =
      'text-text-light-secondary dark:text-text-dark-secondary hover:bg-accent-light dark:hover:bg-accent-dark hover:text-text-light-primary dark:hover:text-text-dark-primary';

    return `${baseClass} ${active ? activeClass : inactiveClass}`;
  };

  return (
    <aside className='flex w-64 flex-col border-r border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4'>
      <div className='flex items-center gap-3 px-2 py-4'>
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white'>
          <span className='material-symbols-outlined text-lg'>
            workspace_premium
          </span>
        </div>
        <div className='flex flex-col'>
          <h1 className='text-base font-bold text-text-light-primary dark:text-text-dark-primary'>
            Staff Awards
          </h1>
          <p className='text-xs font-medium text-text-light-secondary dark:text-text-dark-secondary'>
            Admin Panel
          </p>
        </div>
      </div>
      <nav className='mt-6 flex flex-1 flex-col gap-1'>
        <Link href='/admin' className={getLinkClass('/admin')}>
          <span className='material-symbols-outlined text-xl'>dashboard</span>
          <span className='text-sm font-semibold'>Dashboard</span>
        </Link>
        <Link
          href='/admin/categories'
          className={getLinkClass('/admin/categories')}>
          <span className='material-symbols-outlined text-xl'>category</span>
          <span className='text-sm font-medium'>Categories</span>
        </Link>
        <Link href='/admin/staff' className={getLinkClass('/admin/staff')}>
          <span className='material-symbols-outlined text-xl'>groups</span>
          <span className='text-sm font-medium'>Staff</span>
        </Link>
        <Link
          href='/admin/nominations'
          className={getLinkClass('/admin/nominations')}>
          <span className='material-symbols-outlined text-xl'>rate_review</span>
          <span className='text-sm font-medium'>Nominations</span>
        </Link>
        <Link href='/admin/voting' className={getLinkClass('/admin/voting')}>
          <span className='material-symbols-outlined text-xl'>how_to_vote</span>
          <span className='text-sm font-medium'>Results</span>
        </Link>
        <Link
          href='/admin/settings'
          className={getLinkClass('/admin/settings')}>
          <span className='material-symbols-outlined text-xl'>settings</span>
          <span className='text-sm font-medium'>Settings</span>
        </Link>
      </nav>
      <div className='mt-auto'>
        <button
          onClick={handleLogout}
          className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-text-light-secondary dark:text-text-dark-secondary hover:bg-accent-light dark:hover:bg-accent-dark hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors'>
          <span className='material-symbols-outlined text-xl'>logout</span>
          <span className='text-sm font-medium'>Logout</span>
        </button>
      </div>
    </aside>
  );
}
