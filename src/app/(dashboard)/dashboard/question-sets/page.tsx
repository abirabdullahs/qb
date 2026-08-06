'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface QuestionSetItem {
  id: number;
  name: string;
  negativeMarking: number | string;
  createdAt: string;
  items?: any[];
}

export default function DashboardQuestionSetsPage() {
  const [sets, setSets] = useState<QuestionSetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/question-sets');
      const data = await res.json();
      if (data.success && data.data) {
        setSets(data.data);
      } else {
        setError(data.error || 'Failed to load question sets');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching question sets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question set / mock test?')) return;
    try {
      const res = await fetch(`/api/question-sets/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSets((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(data.error || 'Failed to delete question set');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting question set');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Question Sets & Mock Tests
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage custom exam question sets, practice model tests, and admission mock sets.
          </p>
        </div>

        <Link
          href="/dashboard/question-sets/new"
          className="btn btn-primary"
          style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}
        >
          + Create New Question Set
        </Link>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          Loading question sets...
        </div>
      ) : sets.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '3rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
            No Question Sets Found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            You haven&apos;t created any custom mock tests or question sets yet.
          </p>
          <Link href="/dashboard/question-sets/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Create Your First Question Set
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sets.map((set) => (
            <div
              key={set.id}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                  {set.name}
                </h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                  <span>Questions Count: <strong>{set.items?.length || 0}</strong></span>
                  <span>Negative Marking: <strong>{set.negativeMarking}</strong></span>
                  <span>Created: {new Date(set.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Link
                  href={`/mock-tests/${set.id}`}
                  target="_blank"
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', textDecoration: 'none' }}
                >
                  Preview Mock Test ↗
                </Link>
                <button
                  onClick={() => handleDelete(set.id)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.85rem',
                    background: '#fef2f2',
                    color: '#991b1b',
                    border: '1px solid #fca5a5',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
