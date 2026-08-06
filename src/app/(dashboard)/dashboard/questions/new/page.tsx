'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import QuestionForm from '@/domains/question/QuestionForm';

export default function NewQuestionPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create question');
      }

      setSuccessMsg('Question created successfully.');
      router.push('/dashboard/questions');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create question');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/dashboard/questions" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', marginBottom: '0.5rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Questions</span>
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
          Add New Question
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Create a single question and automatically create a new topic if the selected chapter does not have one yet.
        </p>
      </div>

      {errorMsg && (
        <div style={{ padding: '1rem', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#991B1B', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <div><strong>Error:</strong> {errorMsg}</div>
        </div>
      )}

      {successMsg && (
        <div style={{ padding: '1rem', background: '#F0FDF4', border: '1px solid #A7F3D0', borderRadius: '8px', color: '#166534', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <div>{successMsg}</div>
        </div>
      )}

      <div className="card">
        <QuestionForm onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  );
}
