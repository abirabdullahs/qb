'use client';

import React from 'react';
import { MCQOptionInput } from './mcq.schema';
import MCQOptionList from './MCQOptionList';
import RichTextEditor from '@/components/content/RichTextEditor';

interface MCQEditorProps {
  questionText: string;
  onQuestionTextChange: (val: string) => void;
  options: MCQOptionInput[];
  onOptionsChange: (opts: MCQOptionInput[]) => void;
  explanationText: string;
  onExplanationChange: (val: string) => void;
}

export default function MCQEditor({
  questionText,
  onQuestionTextChange,
  options,
  onOptionsChange,
  explanationText,
  onExplanationChange,
}: MCQEditorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <RichTextEditor
        label="Question Text (প্রশ্ন/প্রশ্নবিবরণ)"
        value={questionText}
        onChange={onQuestionTextChange}
        placeholder="Enter the MCQ question text..."
      />

      <MCQOptionList options={options} onChange={onOptionsChange} />

      <RichTextEditor
        label="Explanation / Solution (ব্যাখ্যা/সমাধান)"
        value={explanationText}
        onChange={onExplanationChange}
        placeholder="Detailed solution explanation with LaTeX math if needed..."
        rows={3}
      />
    </div>
  );
}
