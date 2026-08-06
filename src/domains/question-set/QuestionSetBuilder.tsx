'use client';

import React, { useState } from 'react';
import QuestionPicker from './QuestionPicker';
import { FullQuestion } from '../question/question.repository';

interface QuestionSetBuilderProps {
  onSubmit: (data: { name: string; negativeMarking: number; questionIds: number[] }) => Promise<void>;
  isSubmitting?: boolean;
}

export default function QuestionSetBuilder({ onSubmit, isSubmitting = false }: QuestionSetBuilderProps) {
  const [name, setName] = useState('');
  const [negativeMarking, setNegativeMarking] = useState<number>(0.25);
  const [selectedQuestions, setSelectedQuestions] = useState<FullQuestion[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleToggleQuestion = (question: FullQuestion) => {
    if (selectedQuestions.some((q) => q.id === question.id)) {
      setSelectedQuestions((prev) => prev.filter((q) => q.id !== question.id));
    } else {
      setSelectedQuestions((prev) => [...prev, question]);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const updated = [...selectedQuestions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSelectedQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Question set name is required');
      return;
    }

    if (selectedQuestions.length === 0) {
      setErrorMsg('Please select at least one question for the set');
      return;
    }

    try {
      await onSubmit({
        name,
        negativeMarking,
        questionIds: selectedQuestions.map((q) => q.id),
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create question set');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {errorMsg && (
        <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.9rem' }}>
          {errorMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        <div>
          <label className="form-label">Question Set / Mock Test Title *</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. HSC Physics Chapter 1 Model Test"
            required
          />
        </div>

        <div>
          <label className="form-label">Negative Marking Ratio</label>
          <select
            className="form-input"
            value={negativeMarking}
            onChange={(e) => setNegativeMarking(parseFloat(e.target.value))}
          >
            <option value="0">No Negative Marking (0.00)</option>
            <option value="0.25">0.25 (Standard MCQ Penalty)</option>
            <option value="0.50">0.50 (High Penalty)</option>
          </select>
        </div>
      </div>

      {/* Selected Questions Order List */}
      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem' }}>
          Selected Questions ({selectedQuestions.length})
        </h4>

        {selectedQuestions.length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            No questions added yet. Use the picker below to select questions.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {selectedQuestions.map((q, idx) => (
              <div
                key={q.id}
                style={{
                  padding: '0.6rem 0.85rem',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, color: '#2563eb', marginRight: '0.5rem' }}>Q{idx + 1}.</span>
                  {q.questionText}
                </div>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem' }}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === selectedQuestions.length - 1}
                    style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem' }}
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleQuestion(q)}
                    style={{
                      padding: '0.1rem 0.4rem',
                      fontSize: '0.75rem',
                      background: '#fee2e2',
                      color: '#b91c1c',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <QuestionPicker
        selectedIds={selectedQuestions.map((q) => q.id)}
        onToggleQuestion={handleToggleQuestion}
      />

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
        style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', alignSelf: 'flex-start' }}
      >
        {isSubmitting ? 'Creating Question Set...' : 'Create Question Set / Mock Test'}
      </button>
    </form>
  );
}
