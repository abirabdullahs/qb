import Link from 'next/link';
import { Settings, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function DashboardSettingsPage() {
  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Settings size={28} style={{ color: 'var(--color-primary)' }} />
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
            Dashboard Settings
          </h1>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--color-text-muted)' }}>
            Configure access controls, team accounts, and dashboard preferences.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Access & Permissions</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
            Manage who can see and edit questions, review submissions, and build mock tests. Admins can also configure user roles and invite new staff members.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <ArrowLeft size={20} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Navigation Settings</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
            Customize the dashboard experience by choosing default landing pages, turning on advanced reports, and controlling which menu options appear for staff roles.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link href="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
