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
    approved: { bg: '#dcfce7', text: '#15803d' },
    pending: { bg: '#fef9c3', text: '#a16207' },
    rejected: { bg: '#fee2e2', text: '#b91c1c' },
    draft: { bg: '#f1f5f9', text: '#475569' },
  };

  const difficultyColors = {
    easy: '#16a34a',
    medium: '#d97706',
    hard: '#dc2626',
  };

  const st = statusColors[question.status || 'pending'];

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top Header & Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              background: '#2563eb',
              color: '#ffffff',
            }}
          >
            {question.questionType}
          </span>

          <span
            style={{
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.75rem',
              background: difficultyColors[question.difficulty || 'medium'],
              color: '#ffffff',
              textTransform: 'capitalize',
            }}
          >
            {question.difficulty}
          </span>

          <span
            style={{
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.75rem',
              background: st.bg,
              color: st.text,
            }}
          >
            {question.status}
          </span>

          {question.hasMath && (
            <span
              style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 600,
                fontSize: '0.75rem',
                background: '#f3e8ff',
                color: '#7e22ce',
              }}
            >
              LaTeX Math
            </span>
          )}

          {(question as any).tags && (question as any).tags.length > 0 && (
            <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
              {(question as any).tags.map((t: string, idx: number) => (
                <span
                  key={idx}
                  style={{
                    padding: '0.15rem 0.45rem',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    background: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          ID: #{question.id} | Marks: {question.marks}
        </div>
      </div>

      {/* Main Question Content */}
      <QuestionRenderer question={question} />

      {/* Bottom Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          {question.year ? `Year: ${question.year}` : ''} {question.examName ? `| ${question.examName}` : ''}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link
            href={`/dashboard/questions/${question.id}/edit`}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}
          >
            Edit
          </Link>

          {isAdminOrMod && onStatusChange && question.status === 'pending' && (
            <>
              <button
                type="button"
                onClick={() => onStatusChange(question.id, 'approved')}
                style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.3rem 0.65rem', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(question.id, 'rejected')}
                style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '0.3rem 0.65rem', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Reject
              </button>
            </>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(question.id)}
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', padding: '0.3rem' }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
