import Link from 'next/link';
import { BookOpen, Sparkles, Layers, ArrowRight, GraduationCap } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="main-content">
      <div className="app-container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem', padding: '1rem 0' }}>
          <div className="badge badge-primary" style={{ marginBottom: '1.25rem' }}>
            <Sparkles size={14} style={{ marginRight: '0.35rem' }} />
            Calm Academic • Question Engine
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.25, color: 'var(--color-text-primary)', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Smart Question Bank Platform
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            A clean, minimal, distraction-free environment for SSC, HSC, and Admission preparation with KaTeX math rendering, cluster unit mappings, and structured review workflows.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/questions" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
              <span>Browse Questions</span>
              <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
              <span>Open Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          <div className="card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--color-accent)' }}>
              <BookOpen size={24} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
              Academic Curriculum
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Organized hierarchy from Segments (SSC, HSC) to Group, Subject, Chapter, Topic, and Sub-topic level granularity.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--color-accent)' }}>
              <GraduationCap size={24} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
              Admission Exam Engine
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Supports Single Institute (BUET, DU), Cluster Unit (GST Guccho A/B/C), and Centralized (Medical DGHS) admission models.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--color-accent)' }}>
              <Layers size={24} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
              Rich Question Formats
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Multiple Choice (MCQ), Creative Questions (CQ with stimulus & sub-parts ক/খ/গ/ঘ), and Written formats with KaTeX support.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
