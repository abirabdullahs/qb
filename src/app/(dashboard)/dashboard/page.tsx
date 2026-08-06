import Link from 'next/link';
import { FileText, CheckCircle2, Layers, Plus, BookOpen, Clock } from 'lucide-react';
import { getDashboardStats } from '@/domains/stats/stats.service';
import AttemptChart from '@/domains/stats/AttemptChart';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Dashboard Overview</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Manage questions, review pending submissions, and build curriculum taxonomy.
          </p>
        </div>
        <Link href="/dashboard/questions/new" className="btn btn-primary">
          <Plus size={18} />
          <span>New Question</span>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid-stats" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-accent)' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{stats.totalQuestions}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Questions</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FFFBEB', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #FDE68A' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{stats.pendingQuestions}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Pending Review</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ECFDF5', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #A7F3D0' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{stats.approvedQuestions}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Approved</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-accent)' }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{stats.totalSets}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Question Sets</div>
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AttemptChart
          totalQuestions={stats.totalQuestions}
          approvedQuestions={stats.approvedQuestions}
          pendingQuestions={stats.pendingQuestions}
          rejectedQuestions={stats.rejectedQuestions}
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/dashboard/questions/new" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <Plus size={18} />
              <span>Create MCQ / CQ / Written Question</span>
            </Link>
            <Link href="/dashboard/taxonomy" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <BookOpen size={18} />
              <span>Manage Subjects & Chapters</span>
            </Link>
            <Link href="/dashboard/review" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <CheckCircle2 size={18} />
              <span>Moderator Approval Queue</span>
            </Link>
            <Link href="/dashboard/question-sets" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <Layers size={18} />
              <span>Manage Question Sets</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            System Summary
          </h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div><strong style={{ color: 'var(--color-text-primary)' }}>Total Test Attempts:</strong> {stats.totalAttempts}</div>
            <div><strong style={{ color: 'var(--color-text-primary)' }}>Overall Practice Accuracy:</strong> {stats.accuracyRate}%</div>
            <div><strong style={{ color: 'var(--color-text-primary)' }}>Rejected Submissions:</strong> {stats.rejectedQuestions}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
