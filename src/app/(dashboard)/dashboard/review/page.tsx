'use client';

import React, { useEffect, useState } from 'react';
import ReviewQueue from '@/domains/review/ReviewQueue';
import Link from 'next/link';
import { AuthUser, canReviewQuestions } from '@/lib/auth';

export default function DashboardReviewPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success && data.data?.user) {
          setUser(data.data.user);
        }
      } catch (err) {
        console.error('Failed to check auth status', err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        Verifying reviewer authorization...
      </div>
    );
  }

  if (!user || !canReviewQuestions(user.role)) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center', padding: '2rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#b91c1c', marginBottom: '0.5rem' }}>
          Access Restricted
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Moderator or Admin privileges are required to access the question review and approval queue.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link href="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Sign In as Moderator
          </Link>
          <Link href="/dashboard" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Moderation & Review Queue (প্রশ্ন মূল্যায়ন ও অনুমোদন)
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Review contributor submissions, check mathematical accuracy, and publish to the question bank.
          </p>
        </div>

        <Link href="/dashboard/questions" style={{ color: '#2563eb', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>
          Manage All Questions &rarr;
        </Link>
      </div>

      <ReviewQueue />
    </div>
  );
}
