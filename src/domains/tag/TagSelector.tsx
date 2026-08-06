'use client';

import React from 'react';
import { TagRecord } from './tag.repository';

interface TagSelectorProps {
  selectedTagId?: number | null;
  onSelectTag: (tagId: number | null) => void;
  tags: TagRecord[];
}

export default function TagSelector({ selectedTagId, onSelectTag, tags = [] }: TagSelectorProps) {
  return (
    <select
      className="form-input"
      value={selectedTagId || ''}
      onChange={(e) => onSelectTag(e.target.value ? parseInt(e.target.value, 10) : null)}
      style={{ fontSize: '0.85rem' }}
    >
      <option value="">-- Filter by Tag --</option>
      {tags.map((t) => (
        <option key={t.id} value={t.id}>
          #{t.name}
        </option>
      ))}
    </select>
  );
}
