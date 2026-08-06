'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QuestionFilters from '@/domains/question/QuestionFilters';
import QuestionCard from '@/domains/question/QuestionCard';
import type { QuestionQueryParams } from '@/domains/question/question.queries';
import type { FullQuestion } from '@/domains/question/question.repository';
import type { SubjectItem } from '@/domains/academic/service';

export default function DashboardQuestionsPage() {
  const [filters, setFilters] = useState<QuestionQueryParams>({ page: 1, limit: 10 });
  const [questions, setQuestions] = useState<FullQuestion[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);

  useEffect(() => {
    async function loadSubjects() {
      try {
        const res = await fetch('/api/academic/tree');
        if (!res.ok) throw new Error('Failed to load subject tree');
        const json = await res.json();
        setSubjects(json.data || []);
      } catch (err) {
        console.error('Failed to load curriculum tree:', err);
      }
    }

    loadSubjects();
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (filters.subjectId) query.set('subjectId', String(filters.subjectId));
        if (filters.chapterId) query.set('chapterId', String(filters.chapterId));
        if (filters.topicId) query.set('topicId', String(filters.topicId));
        if (filters.questionType) query.set('questionType', filters.questionType);
        if (filters.difficulty) query.set('difficulty', filters.difficulty);
        if (filters.status) query.set('status', filters.status);
        if (filters.tagId) query.set('tagId', String(filters.tagId));
        if (filters.search) query.set('search', filters.search);
        if (filters.cursor) query.set('cursor', String(filters.cursor));
        query.set('page', String(filters.page || 1));

        const res = await fetch(`/api/questions?${query.toString()}`);
        const data = await res.json();
        if (data.data) {
          setQuestions(data.data.data || []);
          setTotal(data.data.total || 0);
          setHasMore(!!data.data.hasMore);
          setNextCursor(data.data.nextCursor || null);
        }
      } catch (err) {
        console.error('Failed to load questions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [filters]);

  const handleStatusChange = async (id: number, status: 'approved' | 'rejected' | 'pending') => {
    try {
      await fetch(`/api/questions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      alert('Failed to delete question');
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Question Repository (প্রশ্ন ব্যাংক)
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage, filter, review and edit MCQ, CQ, and Written questions
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            href="/dashboard/questions/bulk"
            className="btn btn-secondary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', fontWeight: 600 }}
          >
            Bulk JSON Import
          </Link>
          <Link
            href="/dashboard/questions/new"
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', fontWeight: 600 }}
          >
            + Add New Question
          </Link>
        </div>
      </div>

      <QuestionFilters
        filters={filters}
        onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated, page: 1, cursor: undefined }))}
        subjects={subjects}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>
          Showing {questions.length} of {total} questions
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading questions...</div>
      ) : questions.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            background: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            color: '#64748b',
          }}
        >
          No questions found matching your filter criteria.
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {questions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                isAdminOrMod={true}
              />
            ))}
          </div>

          {/* Cursor & Offset Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button
              className="btn btn-secondary"
              disabled={(!filters.page || filters.page <= 1) && !filters.cursor}
              onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1), cursor: undefined }))}
              style={{ fontSize: '0.85rem' }}
            >
              &larr; Previous Page
            </button>

            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>
              Page {filters.page || 1} {filters.cursor ? `(Cursor: ${filters.cursor})` : ''}
            </span>

            <button
              className="btn btn-secondary"
              disabled={!hasMore}
              onClick={() => {
                if (nextCursor) {
                  setFilters((prev) => ({ ...prev, cursor: nextCursor, page: (prev.page || 1) + 1 }));
                } else {
                  setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }));
                }
              }}
              style={{ fontSize: '0.85rem' }}
            >
              Next Page (Cursor) &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
