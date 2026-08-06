'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import QuestionCard from '@/domains/question/QuestionCard';
import type { FullQuestion } from '@/domains/question/question.repository';

export default function SingleQuestionPage({ params }: { params: Promise<{ questionId: string }> }) {
  const { questionId } = use(params);
  const [question, setQuestion] = useState<FullQuestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await fetch(`/api/questions/${questionId}`);
        const data = await res.json();
        if (data.data) {
          setQuestion(data.data);
        }
      } catch (err) {
        console.error('Failed to load question details', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestion();
  }, [questionId]);

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Loading question...</div>;
  }

  if (!question) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#ef4444' }}>
        Question #{questionId} not found.
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/questions" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem' }}>
          &larr; Back to Question Bank
        </Link>
      </div>

      <QuestionCard question={question} isAdminOrMod={false} />
    </div>
  );
}
