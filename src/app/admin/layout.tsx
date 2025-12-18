'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  isAuthenticatedAdmin,
  validateAdminSession,
} from '@/supabase/services/adminAuth';
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

    const checkAuth = async () => {
      // First check if there's a session token at all
      const hasSession = isAuthenticatedAdmin();
      if (!hasSession) {
        router.push('/admin/login');
        setChecking(false);
        return;
      }

      // Validate session against database (checks session_version)
      const isValid = await validateAdminSession();
      if (!isValid) {
        router.push('/admin/login');
      } else {
        setAuthorized(true);
      }
      setChecking(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (checking) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-background dark:bg-background-dark'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
      </div>
    );
  }

  // If on login page, render children without sidebar structure
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className='flex h-screen w-full overflow-hidden bg-background dark:bg-background-dark admin-theme'>
      <AdminSidebar />
      <div className='flex-1 overflow-y-auto'>{children}</div>
    </div>
  );
}
