'use client';

import React, { useState, useEffect } from 'react';
import QuestionFilters from '@/domains/question/QuestionFilters';
import QuestionCard from '@/domains/question/QuestionCard';
import { QuestionQueryParams } from '@/domains/question/question.queries';
import { FullQuestion } from '@/domains/question/question.repository';
import { getCurriculumTree, SubjectItem } from '@/domains/academic/service';

export default function PublicQuestionsPage() {
  const [filters, setFilters] = useState<QuestionQueryParams>({ page: 1, limit: 10, status: 'approved' });
  const [questions, setQuestions] = useState<FullQuestion[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);

  useEffect(() => {
    getCurriculumTree().then(setSubjects);
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (filters.subjectId) query.set('subjectId', String(filters.subjectId));
        if (filters.chapterId) query.set('chapterId', String(filters.chapterId));
        if (filters.questionType) query.set('questionType', filters.questionType);
        if (filters.difficulty) query.set('difficulty', filters.difficulty);
        if (filters.tagId) query.set('tagId', String(filters.tagId));
        query.set('status', 'approved'); // public users only browse approved questions
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

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Practice Question Bank (প্রশ্ন ব্যাংক)
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Explore thousands of verified HSC, SSC, and Admission test questions with step-by-step solutions and KaTeX mathematical notation.
        </p>
      </div>

      <QuestionFilters
        filters={filters}
        onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated, page: 1, cursor: undefined }))}
        subjects={subjects}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          Available Questions: <span style={{ color: 'var(--color-primary)' }}>{total}</span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading practice questions...</div>
      ) : questions.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--color-text-muted)',
          }}
        >
          No practice questions found matching your criteria.
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} isAdminOrMod={false} />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
            <button
              className="btn btn-secondary"
              disabled={(!filters.page || filters.page <= 1) && !filters.cursor}
              onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1), cursor: undefined }))}
              style={{ fontSize: '0.85rem' }}
            >
              &larr; Previous Page
            </button>

            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Page {filters.page || 1}
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
              Next Page &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
