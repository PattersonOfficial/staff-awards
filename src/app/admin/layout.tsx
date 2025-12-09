'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticatedAdmin } from '@/supabase/services/adminAuth';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Skip check for login page to avoid redirect loop
    if (pathname === '/admin/login') {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    const isAuth = isAuthenticatedAdmin();
    if (!isAuth) {
      router.push('/admin/login');
    } else {
      setAuthorized(true);
    }
    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-[#f6f6f8] dark:bg-background-dark'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
      </div>
    );
  }

  // If on login page, render children without sidebar structure (usually)
  // But layout wraps everything. We might want to render sidebar only if authorized and NOT on login page.
  // However, the login page is typically outside this layout if it was /login, but here it is /admin/login.
  // Let's check pathname.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className='flex h-screen w-full bg-[#f6f6f8] dark:bg-background-dark admin-theme'>
      <AdminSidebar />
      {children}
    </div>
  );
}
