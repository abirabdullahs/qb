'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { QuestionSetRecord } from '@/domains/question-set/question-set.repository';

export default function PublicMockTestsPage() {
  const [sets, setSets] = useState<QuestionSetRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSets() {
      try {
        const res = await fetch('/api/question-sets');
        const data = await res.json();
        if (data.data) {
          setSets(data.data);
        }
      } catch (err) {
        console.error('Failed to load mock tests:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSets();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Online Practice Mocks & Model Tests (মডেল টেস্ট)
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '0.5rem', maxWidth: '650px', margin: '0.5rem auto 0' }}>
          Test your knowledge under real exam conditions with automatic scoring, negative marking, and complete solution breakdowns.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading practice tests...</div>
      ) : sets.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            color: '#64748b',
          }}
        >
          No active mock tests available right now. Check back soon!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {sets.map((set) => (
            <div
              key={set.id}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div>
                <span
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: '#eff6ff',
                    color: '#2563eb',
                    textTransform: 'uppercase',
                    display: 'inline-block',
                    marginBottom: '0.75rem',
                  }}
                >
                  Mock Exam
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.4 }}>
                  {set.name}
                </h3>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                  <span>Questions: {set.items?.length || 0}</span>
                  <span>•</span>
                  <span>Penalty: -{set.negativeMarking || 0}</span>
                </div>
              </div>

              <Link
                href={`/mock-tests/${set.id}`}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  padding: '0.7rem',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  borderRadius: '8px',
                }}
              >
                Start Exam Now &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
