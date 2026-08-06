'use client';

import React from 'react';
import { FullQuestion } from './question.repository';
import QuestionRenderer from './QuestionRenderer';
import Link from 'next/link';

interface QuestionCardProps {
  question: FullQuestion;
  onStatusChange?: (id: number, status: 'approved' | 'rejected' | 'pending') => void;
  onDelete?: (id: number) => void;
  isAdminOrMod?: boolean;
}

export default function QuestionCard({ question, onStatusChange, onDelete, isAdminOrMod = false }: QuestionCardProps) {
  const statusColors = {
    approved: { bg: '#ECFDF5', text: '#166534', border: '#A7F3D0' },
    pending: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
    rejected: { bg: '#FEF2F2', text: '#991B1B', border: '#FCA5A5' },
    draft: { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' },
  };

  const difficultyColors = {
    easy: { bg: '#ECFDF5', text: '#15803D' },
    medium: { bg: '#FFFBEB', text: '#B45309' },
    hard: { bg: '#FEF2F2', text: '#B91C1C' },
  };

  const st = statusColors[question.status || 'pending'] || statusColors.pending;
  const diff = difficultyColors[question.difficulty || 'medium'] || difficultyColors.medium;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Top Header & Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '0.25rem 0.625rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              background: 'var(--color-primary)',
              color: '#ffffff',
            }}
          >
            {question.questionType}
          </span>

          <span
            style={{
              padding: '0.25rem 0.625rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.75rem',
              background: diff.bg,
              color: diff.text,
              textTransform: 'capitalize',
            }}
          >
            {question.difficulty}
          </span>

          <span
            style={{
              padding: '0.25rem 0.625rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.75rem',
              background: st.bg,
              color: st.text,
              border: `1px solid ${st.border}`,
            }}
          >
            {question.status}
          </span>

          {question.hasMath && (
            <span
              style={{
                padding: '0.25rem 0.625rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.75rem',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-accent)',
              }}
            >
              KaTeX Math
            </span>
          )}

          {(question as any).tags && (question as any).tags.length > 0 && (
            <div style={{ display: 'inline-flex', gap: '0.25rem', flexWrap: 'wrap' }}>
              {(question as any).tags.map((t: string, idx: number) => (
                <span
                  key={idx}
                  style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-accent)',
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          ID: #{question.id} | Marks: {question.marks}
        </div>
      </div>

      {/* Main Question Content */}
      <QuestionRenderer question={question} />

      {/* Bottom Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {question.year ? `Year: ${question.year}` : ''} {question.examName ? `| ${question.examName}` : ''}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link
            href={`/dashboard/questions/${question.id}/edit`}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem', minHeight: '34px' }}
          >
            Edit
          </Link>

          {isAdminOrMod && onStatusChange && question.status === 'pending' && (
            <>
              <button
                type="button"
                onClick={() => onStatusChange(question.id, 'approved')}
                style={{ background: 'var(--color-success)', color: '#fff', border: 'none', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', minHeight: '34px' }}
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(question.id, 'rejected')}
                style={{ background: 'var(--color-danger)', color: '#fff', border: 'none', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', minHeight: '34px' }}
              >
                Reject
              </button>
            </>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(question.id)}
              style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, padding: '0.3rem 0.5rem' }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
