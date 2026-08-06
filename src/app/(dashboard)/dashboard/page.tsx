import Link from 'next/link';
import { cookies } from 'next/headers';
import { FileText, CheckCircle2, Layers, Plus, BookOpen, Clock, Bookmark, Search, ArrowRight } from 'lucide-react';
import { getDashboardStats } from '@/domains/stats/stats.service';
import AttemptChart from '@/domains/stats/AttemptChart';
import { parseSessionToken } from '@/lib/auth';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('qb_session')?.value;
  const user = token ? parseSessionToken(token) : null;
  const role = user?.role || 'student';
  const isStudent = role === 'student';

  const stats = await getDashboardStats();

  if (isStudent) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Student Dashboard</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Welcome back, <strong>{user?.name || 'Student'}</strong>! Practice verified questions and revise your saved bookmarks.
            </p>
          </div>
          <Link href="/questions" className="btn btn-primary">
            <Search size={18} />
            <span>Start Practice</span>
          </Link>
        </div>

        {/* Student Stats Cards */}
        <div className="grid-stats" style={{ marginBottom: '1.5rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-accent)' }}>
              <FileText size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{stats.approvedQuestions}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Practice Questions</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #FCD34D' }}>
              <Bookmark size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Bookmarks</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Saved Revision Items</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ECFDF5', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #A7F3D0' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{stats.accuracyRate}%</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Global Practice Accuracy</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-accent)' }}>
              <Layers size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{stats.totalSets}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Mock Test Question Sets</div>
            </div>
          </div>
        </div>

        {/* Student Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/questions" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                <Search size={18} />
                <span>Browse Practice Questions</span>
              </Link>
              <Link href="/dashboard/bookmarks" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Bookmark size={18} />
                <span>View My Bookmarked Questions</span>
              </Link>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
              Study Guidance
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Filter questions by SSC/HSC subject, chapter, or Admission exam body (BUET, DU, GST) to focus your revision on weak areas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Admin / Moderator / Contributor / Teacher Dashboard
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
            {(role === 'admin' || role === 'moderator' || role === 'teacher') && (
              <Link href="/dashboard/taxonomy" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <BookOpen size={18} />
                <span>Manage Subjects & Chapters</span>
              </Link>
            )}
            {(role === 'admin' || role === 'moderator') && (
              <Link href="/dashboard/review" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <CheckCircle2 size={18} />
                <span>Moderator Approval Queue</span>
              </Link>
            )}
            {(role === 'admin' || role === 'moderator' || role === 'teacher') && (
              <Link href="/dashboard/question-sets" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Layers size={18} />
                <span>Manage Question Sets</span>
              </Link>
            )}
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
