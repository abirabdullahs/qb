import Link from 'next/link';
import { BookOpen, Sparkles, CheckCircle, Search, Layers, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="main-content">
      <div className="app-container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
          <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} style={{ marginRight: '0.25rem' }} />
            Academic & Admission Question Engine
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, color: '#0f172a', marginBottom: '1.25rem' }}>
            Smart Question Bank Platform
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
            Comprehensive question bank for SSC, HSC, and Admission preparation with LaTeX mathematical rendering, cluster unit mappings, and structured review workflows.
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          <div className="card">
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <BookOpen size={24} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
              Academic Curriculum
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
              Organized hierarchy from Segments (SSC, HSC) to Group, Subject, Chapter, Topic, and Sub-topic level granularity.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
              Admission Exam Engine
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
              Supports Single Institute (BUET, DU), Cluster Unit (GST Guccho A/B/C), and Centralized (Medical DGHS) admission models.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Layers size={24} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
              Rich Question Types
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
              Multiple Choice (MCQ), Creative Questions (CQ with stimulus & sub-parts ক/খ/গ/ঘ), and Written formats with LaTeX support.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
