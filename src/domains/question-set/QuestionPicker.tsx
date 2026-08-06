'use client';

import React, { useState, useEffect } from 'react';
import { FullQuestion } from '../question/question.repository';

interface QuestionPickerProps {
  selectedIds: number[];
  onToggleQuestion: (question: FullQuestion) => void;
}

export default function QuestionPicker({ selectedIds, onToggleQuestion }: QuestionPickerProps) {
  const [questions, setQuestions] = useState<FullQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        query.set('status', 'approved');
        if (search) query.set('search', search);

        const res = await fetch(`/api/questions?${query.toString()}`);
        const data = await res.json();
        if (data.data) {
          setQuestions(data.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load questions for picker:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [search]);

  return (
    <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', background: '#ffffff' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
          Select Questions to Include (প্রশ্ন নির্বাচন করুন)
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="Search questions by text or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading available questions...</div>
      ) : questions.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No questions available matching search.</div>
      ) : (
        <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {questions.map((q) => {
            const isSelected = selectedIds.includes(q.id);
            return (
              <div
                key={q.id}
                onClick={() => onToggleQuestion(q)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: `1px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                  background: isSelected ? '#eff6ff' : '#f8fafc',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div style={{ flex: 1, fontSize: '0.9rem', color: '#1e293b' }}>
                  <span style={{ fontWeight: 700, color: '#2563eb', marginRight: '0.5rem' }}>
                    #{q.id} [{q.questionType.toUpperCase()}]
                  </span>
                  {q.questionText}
                </div>
                <button
                  type="button"
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    background: isSelected ? '#ef4444' : '#2563eb',
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  {isSelected ? 'Remove' : '+ Select'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
