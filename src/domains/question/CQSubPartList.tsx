'use client';

import React from 'react';
import { CQSubPartInput } from './cq.schema';
import MathEditor from '@/components/content/MathEditor';

interface CQSubPartListProps {
  subParts: CQSubPartInput[];
  onChange: (parts: CQSubPartInput[]) => void;
}

const DEFAULT_CQ_PARTS: { label: string; level: 'knowledge' | 'comprehension' | 'application' | 'higher_ability'; marks: number; desc: string }[] = [
  { label: 'ক', level: 'knowledge', marks: 1, desc: 'জ্ঞানমূলক' },
  { label: 'খ', level: 'comprehension', marks: 2, desc: 'অনুধাবনমূলক' },
  { label: 'গ', level: 'application', marks: 3, desc: 'প্রয়োগমূলক' },
  { label: 'ঘ', level: 'higher_ability', marks: 4, desc: 'উচ্চতর চিন্তনদক্ষতা' },
];

export default function CQSubPartList({ subParts, onChange }: CQSubPartListProps) {
  const handlePartChange = (index: number, field: keyof CQSubPartInput, val: any) => {
    const updated = [...subParts];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const handleAddPart = () => {
    if (subParts.length >= 6) return;
    const nextIdx = subParts.length;
    const def = DEFAULT_CQ_PARTS[nextIdx] || { label: `${nextIdx + 1}`, level: 'knowledge', marks: 1, desc: '' };
    const newPart: CQSubPartInput = {
      partLabel: def.label,
      partText: '',
      marks: def.marks,
      cognitiveLevel: def.level,
      orderNo: nextIdx + 1,
    };
    onChange([...subParts, newPart]);
  };

  const handleRemovePart = (index: number) => {
    if (subParts.length <= 1) return;
    const filtered = subParts.filter((_, i) => i !== index);
    onChange(filtered);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
          CQ Sub-parts (ক/খ/গ/ঘ) - Total Marks: {subParts.reduce((acc, curr) => acc + (Number(curr.marks) || 0), 0)}
        </h4>
        {subParts.length < 6 && (
          <button
            type="button"
            onClick={handleAddPart}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
          >
            + Add Sub-part
          </button>
        )}
      </div>

      {subParts.map((part, index) => (
        <div
          key={index}
          style={{
            padding: '0.85rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#2563eb',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                {part.partLabel}
              </span>

              <select
                className="form-input"
                style={{ padding: '0.2rem 0.4rem', fontSize: '0.8rem', width: 'auto' }}
                value={part.cognitiveLevel || 'knowledge'}
                onChange={(e) => handlePartChange(index, 'cognitiveLevel', e.target.value)}
              >
                <option value="knowledge">জ্ঞানমূলক (Knowledge)</option>
                <option value="comprehension">অনুধাবনমূলক (Comprehension)</option>
                <option value="application">প্রয়োগমূলক (Application)</option>
                <option value="higher_ability">উচ্চতর চিন্তনদক্ষতা (Higher Ability)</option>
              </select>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                <span>Marks:</span>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  className="form-input"
                  style={{ width: '60px', padding: '0.2rem 0.3rem', fontSize: '0.8rem' }}
                  value={part.marks}
                  onChange={(e) => handlePartChange(index, 'marks', parseFloat(e.target.value) || 1)}
                />
              </div>
            </div>

            {subParts.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemovePart(index)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Remove
              </button>
            )}
          </div>

          <MathEditor
            value={part.partText}
            onChange={(val) => handlePartChange(index, 'partText', val)}
            placeholder={`Enter sub-part (${part.partLabel}) text...`}
          />

          <MathEditor
            value={part.answerText || ''}
            onChange={(val) => handlePartChange(index, 'answerText', val)}
            placeholder={`Sub-part (${part.partLabel}) Answer / Solution...`}
          />
        </div>
      ))}
    </div>
  );
}
