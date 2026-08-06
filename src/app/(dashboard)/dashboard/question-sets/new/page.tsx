'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QuestionSetBuilder from '@/domains/question-set/QuestionSetBuilder';

export default function NewQuestionSetPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: { name: string; negativeMarking: number; questionIds: number[] }) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/question-sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      if (!res.ok || !responseData.success) {
        throw new Error(responseData.error || 'Failed to create question set');
      }

      router.push('/dashboard/question-sets');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/dashboard/question-sets" style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
          &larr; Back to Question Sets
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0' }}>
          Create New Question Set / Mock Test
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Select approved questions from the repository to assemble a full exam paper or model test.
        </p>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '1.5rem' }}>
        <QuestionSetBuilder onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  );
}
