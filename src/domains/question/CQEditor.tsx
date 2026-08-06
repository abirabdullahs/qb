'use client';

import React from 'react';
import { CQSubPartInput } from './cq.schema';
import CQSubPartList from './CQSubPartList';
import RichTextEditor from '@/components/content/RichTextEditor';

interface CQEditorProps {
  stimulusText: string;
  onStimulusChange: (val: string) => void;
  subParts: CQSubPartInput[];
  onSubPartsChange: (parts: CQSubPartInput[]) => void;
}

export default function CQEditor({ stimulusText, onStimulusChange, subParts, onSubPartsChange }: CQEditorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <RichTextEditor
        label="Stimulus / Stem (উদ্দীপক)"
        value={stimulusText}
        onChange={onStimulusChange}
        placeholder="Enter the passage, diagram scenario, or context stem (উদ্দীপক)..."
        rows={4}
      />

      <CQSubPartList subParts={subParts} onChange={onSubPartsChange} />
    </div>
  );
}
