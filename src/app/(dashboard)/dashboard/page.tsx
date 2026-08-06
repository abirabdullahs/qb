import Link from 'next/link';
import { FileText, CheckCircle2, Layers, Plus, BookOpen, Clock } from 'lucide-react';
import { getDashboardStats } from '@/domains/stats/stats.service';
import AttemptChart from '@/domains/stats/AttemptChart';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Dashboard Overview</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
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
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{stats.totalQuestions}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Questions</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{stats.pendingQuestions}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Pending Review</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{stats.approvedQuestions}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Approved</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{stats.totalSets}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Question Sets</div>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
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
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
            System Summary
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div><strong>Total Test Attempts:</strong> {stats.totalAttempts}</div>
            <div><strong>Overall Practice Accuracy:</strong> {stats.accuracyRate}%</div>
            <div><strong>Rejected Submissions:</strong> {stats.rejectedQuestions}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

