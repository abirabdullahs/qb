'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { QuestionSetRecord } from '@/domains/question-set/question-set.repository';
import MockTestPlayer from '@/domains/question-set/MockTestPlayer';
import Link from 'next/link';

export default function SingleMockTestPage() {
  const params = useParams();
  const idStr = params?.id as string;
  const [questionSet, setQuestionSet] = useState<QuestionSetRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      if (!idStr) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/question-sets/${idStr}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to load exam details');
        }
        setQuestionSet(data.data);
      } catch (err: any) {
        setErrorMsg(err.message || 'Error loading exam');
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [idStr]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading mock exam player...</div>;
  }

  if (errorMsg || !questionSet) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center', padding: '2rem', background: '#ffffff', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
        <h3 style={{ color: '#b91c1c', fontSize: '1.2rem', fontWeight: 700 }}>Exam Not Found</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {errorMsg || 'The requested test could not be loaded.'}
        </p>
        <Link href="/mock-tests" className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-block' }}>
          &larr; Return to Mock Tests
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto 1rem' }}>
        <Link href="/mock-tests" style={{ color: '#2563eb', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
          &larr; Exit Exam & Back to All Tests
        </Link>
      </div>

      <MockTestPlayer questionSet={questionSet} />
    </div>
  );
}
