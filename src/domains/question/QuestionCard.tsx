'use client';

import React, { useState } from 'react';
import { FullQuestion } from './question.repository';
import QuestionRenderer from './QuestionRenderer';
import Link from 'next/link';
import { Bookmark, Sparkles, BookOpen } from 'lucide-react';
import LatexRenderer from '../content/LatexRenderer';

interface QuestionCardProps {
  question: FullQuestion;
  onStatusChange?: (id: number, status: 'approved' | 'rejected' | 'pending') => void;
  onDelete?: (id: number) => void;
  isAdminOrMod?: boolean;
  initialBookmarked?: boolean;
  onBookmarkToggle?: (questionId: number, isBookmarked: boolean) => void;
}

export default function QuestionCard({
  question,
  onStatusChange,
  onDelete,
  isAdminOrMod = false,
  initialBookmarked = false,
  onBookmarkToggle,
}: QuestionCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showConcept, setShowConcept] = useState(false);

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

  const handleBookmarkClick = async () => {
    setIsBookmarking(true);
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id }),
      });

      if (res.status === 401) {
        setShowLoginPrompt(true);
        setIsBookmarking(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        const nextState = data.data.isBookmarked;
        setIsBookmarked(nextState);
        if (onBookmarkToggle) {
          onBookmarkToggle(question.id, nextState);
        }
      } else {
        setShowLoginPrompt(true);
      }
    } catch {
      setShowLoginPrompt(true);
    } finally {
      setIsBookmarking(false);
    }
  };

  // Check if topic concept exists
  const topicConcept = (question as any).topicConcept || (question as any).concept;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
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

          {topicConcept && (
            <button
              type="button"
              onClick={() => setShowConcept(!showConcept)}
              style={{
                padding: '0.25rem 0.625rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.75rem',
                background: '#F0FDF4',
                color: '#15803D',
                border: '1px solid #BBF7D0',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Sparkles size={12} />
              <span>{showConcept ? 'Hide Concept' : 'View Concept'}</span>
            </button>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            ID: #{question.id} | Marks: {question.marks}
          </div>

          <button
            type="button"
            onClick={handleBookmarkClick}
            disabled={isBookmarking}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
            style={{
              background: isBookmarked ? '#FEF3C7' : 'var(--color-bg-subtle)',
              border: isBookmarked ? '1px solid #FCD34D' : '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '0.35rem 0.6rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: isBookmarked ? '#D97706' : 'var(--color-text-muted)',
              transition: 'all 0.2s',
            }}
          >
            <Bookmark size={15} fill={isBookmarked ? '#D97706' : 'none'} />
            <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
          </button>
        </div>
      </div>

      {/* Topic Concept Section with LaTeX Rendering */}
      {showConcept && topicConcept && (
        <div
          style={{
            padding: '0.85rem 1rem',
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#166534',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#15803D' }}>
            <BookOpen size={16} />
            <span>Topic Core Concept (মৌলিক ধারণা):</span>
          </div>
          <LatexRenderer content={topicConcept} />
        </div>
      )}

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

      {/* Login Prompt Modal for Unauthenticated Bookmarking */}
      {showLoginPrompt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setShowLoginPrompt(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '1.5rem',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bookmark size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Registration Required</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Browsing questions is free for everyone, but saving bookmarks for revision requires a user account.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowLoginPrompt(false)}
              >
                Cancel
              </button>
              <Link href="/login" className="btn btn-secondary">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
