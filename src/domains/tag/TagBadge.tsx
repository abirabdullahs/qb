'use client';

import React from 'react';

interface TagBadgeProps {
  name: string;
  onRemove?: () => void;
  color?: string;
}

export default function TagBadge({ name, onRemove, color = '#3b82f6' }: TagBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.2rem 0.6rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        background: `${color}15`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      #{name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          style={{
            background: 'none',
            border: 'none',
            color: color,
            cursor: 'pointer',
            padding: 0,
            fontSize: '0.85rem',
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          &times;
        </button>
      )}
    </span>
  );
}
