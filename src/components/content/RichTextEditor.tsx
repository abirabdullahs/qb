'use client';

import React, { useState } from 'react';
import MathEditor from './MathEditor';
import LatexRenderer from './LatexRenderer';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
}

export default function RichTextEditor({ value, onChange, label, placeholder, rows = 4 }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  return (
    <div className="form-group" style={{ marginBottom: '1rem' }}>
      {label && <label className="form-label">{label}</label>}

      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('write')}
          style={{
            padding: '0.4rem 0.85rem',
            fontSize: '0.85rem',
            borderBottom: activeTab === 'write' ? '2px solid #2563eb' : 'none',
            fontWeight: activeTab === 'write' ? 600 : 400,
            color: activeTab === 'write' ? '#2563eb' : '#64748b',
          }}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          style={{
            padding: '0.4rem 0.85rem',
            fontSize: '0.85rem',
            borderBottom: activeTab === 'preview' ? '2px solid #2563eb' : 'none',
            fontWeight: activeTab === 'preview' ? 600 : 400,
            color: activeTab === 'preview' ? '#2563eb' : '#64748b',
          }}
        >
          Preview Math & Text
        </button>
      </div>

      {activeTab === 'write' ? (
        <MathEditor value={value} onChange={onChange} placeholder={placeholder} />
      ) : (
        <div style={{ padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: `${rows * 24}px`, background: '#fff' }}>
          {value ? <LatexRenderer content={value} /> : <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No content entered</span>}
        </div>
      )}
    </div>
  );
}
