'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search by text, topic, or keyword...',
  onClear,
}: SearchBarProps) {
  const [internalVal, setInternalVal] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalVal(val);
    onChange(val);
  };

  const handleClear = () => {
    setInternalVal('');
    onChange('');
    if (onClear) onClear();
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Search
        size={18}
        style={{
          position: 'absolute',
          left: '0.85rem',
          color: '#94a3b8',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        className="form-input"
        style={{
          paddingLeft: '2.5rem',
          paddingRight: internalVal ? '2.25rem' : '0.85rem',
          width: '100%',
        }}
        placeholder={placeholder}
        value={internalVal}
        onChange={handleChange}
      />
      {internalVal && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: '0.75rem',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '2px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
