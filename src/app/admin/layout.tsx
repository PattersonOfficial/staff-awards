import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[#f6f6f8] dark:bg-background-dark admin-theme">
      <AdminSidebar />
      {children}
    </div>
  );
}
