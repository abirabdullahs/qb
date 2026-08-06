'use client';

import React from 'react';
import { MCQOptionInput } from './mcq.schema';
import MathEditor from '@/components/content/MathEditor';

interface MCQOptionListProps {
  options: MCQOptionInput[];
  onChange: (options: MCQOptionInput[]) => void;
}

const DEFAULT_LABELS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];
const ENG_LABELS = ['A', 'B', 'C', 'D', 'E'];

export default function MCQOptionList({ options, onChange }: MCQOptionListProps) {
  const handleTextChange = (index: number, text: string) => {
    const updated = [...options];
    updated[index] = { ...updated[index], optionText: text };
    onChange(updated);
  };

  const handleCorrectToggle = (index: number) => {
    const updated = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index, // Default single correct
    }));
    onChange(updated);
  };

  const handleAddOption = () => {
    if (options.length >= 5) return;
    const nextIdx = options.length;
    const newOpt: MCQOptionInput = {
      optionLabel: DEFAULT_LABELS[nextIdx] || ENG_LABELS[nextIdx] || `${nextIdx + 1}`,
      optionText: '',
      isCorrect: false,
      orderNo: nextIdx + 1,
    };
    onChange([...options, newOpt]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    const filtered = options.filter((_, i) => i !== index);
    const reindexed = filtered.map((opt, idx) => ({
      ...opt,
      optionLabel: DEFAULT_LABELS[idx] || ENG_LABELS[idx] || `${idx + 1}`,
      orderNo: idx + 1,
    }));
    onChange(reindexed);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
          MCQ Options ({options.length}/5)
        </h4>
        {options.length < 5 && (
          <button
            type="button"
            onClick={handleAddOption}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
          >
            + Add Option
          </button>
        )}
      </div>

      {options.map((opt, index) => (
        <div
          key={index}
          style={{
            padding: '0.85rem',
            border: opt.isCorrect ? '2px solid #16a34a' : '1px solid #e2e8f0',
            borderRadius: '8px',
            backgroundColor: opt.isCorrect ? '#f0fdf4' : '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: opt.isCorrect ? '#16a34a' : '#cbd5e1',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                {opt.optionLabel}
              </span>
              <label style={{ cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: opt.isCorrect ? '#15803d' : '#475569' }}>
                <input
                  type="radio"
                  name="correct_option"
                  checked={opt.isCorrect}
                  onChange={() => handleCorrectToggle(index)}
                  style={{ marginRight: '0.4rem', accentColor: '#16a34a' }}
                />
                Correct Answer
              </label>
            </div>

            {options.length > 2 && (
              <button
                type="button"
                onClick={() => handleRemoveOption(index)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Remove
              </button>
            )}
          </div>

          <MathEditor
            value={opt.optionText}
            onChange={(val) => handleTextChange(index, val)}
            placeholder={`Option ${opt.optionLabel} text (supports LaTeX $x^2$)...`}
          />
        </div>
      ))}
    </div>
  );
}
