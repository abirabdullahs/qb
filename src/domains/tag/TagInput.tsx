'use client';

import React, { useState, useEffect } from 'react';
import TagBadge from './TagBadge';
import { TagRecord } from './tag.repository';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  availableTags?: TagRecord[];
}

export default function TagInput({ tags = [], onChange, availableTags = [] }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (name: string) => {
    const trimmed = name.trim().replace(/^#/, '');
    if (!trimmed) return;
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...tags, trimmed]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  const handleRemove = (index: number) => {
    const updated = [...tags];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
        Question Tags (ট্যাগসমূহ)
      </label>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.25rem' }}>
        {tags.map((tag, idx) => (
          <TagBadge key={idx} name={tag} onRemove={() => handleRemove(idx)} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          className="form-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type tag (e.g. HSC-2025, BUET) & press Enter..."
          style={{ flex: 1 }}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => handleAddTag(inputValue)}
          style={{ fontSize: '0.85rem' }}
        >
          Add Tag
        </button>
      </div>

      {availableTags.length > 0 && (
        <div style={{ marginTop: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginRight: '0.5rem' }}>Suggested:</span>
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {availableTags
              .filter((t) => !tags.includes(t.name))
              .slice(0, 6)
              .map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleAddTag(t.name)}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '0.1rem 0.4rem',
                    fontSize: '0.75rem',
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                >
                  +{t.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
