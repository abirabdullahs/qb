'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
        query.set('status', 'approved'); // public users only browse approved questions
        if (filters.search) query.set('search', filters.search);
        query.set('page', String(filters.page || 1));

        const res = await fetch(`/api/questions?${query.toString()}`);
        const data = await res.json();
        if (data.data) {
          setQuestions(data.data.data || []);
          setTotal(data.data.total || 0);
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
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          Practice Question Bank (প্রশ্ন ব্যাংক)
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore thousands of verified HSC, SSC, and Admission test questions with step-by-step solutions and KaTeX mathematical notation.
        </p>
      </div>

      <QuestionFilters
        filters={filters}
        onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
        subjects={subjects}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>
          Available Questions: {total}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading practice questions...</div>
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
          No practice questions found matching your criteria.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {questions.map((q) => (
            <QuestionCard key={q.id} question={q} isAdminOrMod={false} />
          ))}
        </div>
      )}
    </div>
  );
}
