'use client';

import React from 'react';
import RichTextEditor from '@/components/content/RichTextEditor';

interface WrittenEditorProps {
  questionText: string;
  onQuestionTextChange: (val: string) => void;
  answerText: string;
  onAnswerTextChange: (val: string) => void;
  explanationText: string;
  onExplanationChange: (val: string) => void;
  marks: number;
  onMarksChange: (m: number) => void;
}

export default function WrittenEditor({
  questionText,
  onQuestionTextChange,
  answerText,
  onAnswerTextChange,
  explanationText,
  onExplanationChange,
  marks,
  onMarksChange,
}: WrittenEditorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <label className="form-label">Marks (নম্বর)</label>
          <input
            type="number"
            step="0.5"
            min="1"
            className="form-input"
            value={marks}
            onChange={(e) => onMarksChange(parseFloat(e.target.value) || 1)}
          />
        </div>
      </div>

      <RichTextEditor
        label="Written Question Prompt (রচনামূলক প্রশ্ন)"
        value={questionText}
        onChange={onQuestionTextChange}
        placeholder="Enter written question prompt..."
        rows={3}
      />

      <RichTextEditor
        label="Model Answer / Solution (উত্তর/সমাধান)"
        value={answerText}
        onChange={onAnswerTextChange}
        placeholder="Enter complete model answer or step-by-step solution..."
        rows={4}
      />

      <RichTextEditor
        label="Additional Explanation / Notes (অতিরিক্ত ব্যাখ্যা)"
        value={explanationText}
        onChange={onExplanationChange}
        placeholder="Optional notes or hints for grading..."
        rows={3}
      />
    </div>
  );
}
