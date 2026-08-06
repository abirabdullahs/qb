import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '2.5rem 0 1.5rem', marginTop: 'auto' }}>
      <div className="app-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div className="logo" style={{ marginBottom: '0.75rem' }}>
              <div className="logo-icon">
                <BookOpen size={18} />
              </div>
              <span>Question Bank</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
              Online Smart Question Bank for Academic (SSC, HSC) and Admission test preparation.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>Academic</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
              <li><Link href="/questions?segment=SSC">SSC Questions</Link></li>
              <li><Link href="/questions?segment=HSC">HSC Questions</Link></li>
              <li><Link href="/questions?type=MCQ">MCQ Collection</Link></li>
              <li><Link href="/questions?type=CQ">Creative Questions (CQ)</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>Admission</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
              <li><Link href="/questions?adm=ENG">Engineering (BUET/CKRUET)</Link></li>
              <li><Link href="/questions?adm=MED">Medical (MBBS)</Link></li>
              <li><Link href="/questions?adm=VAR">GST Guccho & University</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>Account & Dashboard</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
              <li><Link href="/dashboard">Contributor Dashboard</Link></li>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/register">Register</Link></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
          <p>© {new Date().getFullYear()} Question Bank Platform. All rights reserved.</p>
          <p>Built with Next.js, TypeScript & Drizzle ORM</p>
        </div>
      </div>
    </footer>
  );
}
