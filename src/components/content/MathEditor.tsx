'use client';

import React, { useState } from 'react';
import LatexRenderer from './LatexRenderer';

interface MathEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
}

const MATH_SNIPPETS = [
  { label: 'Fraction', latex: '\\frac{a}{b}' },
  { label: 'Power', latex: 'x^{2}' },
  { label: 'Subscript', latex: 'x_{1}' },
  { label: 'Sqrt', latex: '\\sqrt{x}' },
  { label: 'Integral', latex: '\\int_{a}^{b} f(x)dx' },
  { label: 'Vector', latex: '\\vec{v}' },
  { label: 'Theta', latex: '\\theta' },
  { label: 'Pi', latex: '\\pi' },
  { label: 'Degree', latex: '^\top' },
  { label: 'Infinity', latex: '\\infty' },
  { label: 'Plus-Minus', latex: '\\pm' },
];

export default function MathEditor({ value, onChange, placeholder = 'Type text or LaTeX ($E=mc^2$)...', label }: MathEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const insertSnippet = (snippet: string) => {
    const formattedSnippet = ` $${snippet}$ `;
    onChange(value + formattedSnippet);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && <label className="form-label">{label}</label>}

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', alignSelf: 'center', marginRight: '0.25rem' }}>
          Math Toolbar:
        </span>
        {MATH_SNIPPETS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => insertSnippet(item.latex)}
            className="btn btn-secondary"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', height: 'auto' }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Editor & Preview Toggle */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '1rem', fontSize: '0.875rem' }}>
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          style={{
            padding: '0.4rem 0.75rem',
            borderBottom: !showPreview ? '2px solid #2563eb' : 'none',
            fontWeight: !showPreview ? 600 : 400,
            color: !showPreview ? '#2563eb' : '#64748b',
          }}
        >
          Editor
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          style={{
            padding: '0.4rem 0.75rem',
            borderBottom: showPreview ? '2px solid #2563eb' : 'none',
            fontWeight: showPreview ? 600 : 400,
            color: showPreview ? '#2563eb' : '#64748b',
          }}
        >
          Live Preview
        </button>
      </div>

      {!showPreview ? (
        <textarea
          className="form-input"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
        />
      ) : (
        <div style={{ minHeight: '80px', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#ffffff' }}>
          {value ? <LatexRenderer content={value} /> : <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Nothing to preview</span>}
        </div>
      )}
    </div>
  );
}
