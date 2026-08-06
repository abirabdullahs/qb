'use client';

import React, { useState, useEffect } from 'react';
import QuestionCard from '../question/QuestionCard';
import { FullQuestion } from '../question/question.repository';
import ApproveButton from './ApproveButton';
import RejectButton from './RejectButton';

export default function ReviewQueue() {
  const [pendingQuestions, setPendingQuestions] = useState<FullQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/questions?status=pending');
      const data = await res.json();
      if (data.data) {
        setPendingQuestions(data.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load pending review queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleActionCompleted = (id: number) => {
    setPendingQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading review queue...</div>;
  }

  if (pendingQuestions.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          color: '#475569',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Review Queue Clean!</h3>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
          All submitted questions have been reviewed and processed.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>
        {pendingQuestions.length} question(s) pending moderator approval
      </div>

      {pendingQuestions.map((q) => (
        <div
          key={q.id}
          style={{
            background: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <QuestionCard question={q} isAdminOrMod={true} />

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <RejectButton questionId={q.id} onSuccess={() => handleActionCompleted(q.id)} />
            <ApproveButton questionId={q.id} onSuccess={() => handleActionCompleted(q.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}
