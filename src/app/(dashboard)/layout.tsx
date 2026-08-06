import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
