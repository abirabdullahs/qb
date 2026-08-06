'use client';

import React, { useState } from 'react';

interface ApproveButtonProps {
  questionId: number;
  onSuccess?: () => void;
}

export default function ApproveButton({ questionId, onSuccess }: ApproveButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });
      if (!res.ok) throw new Error('Failed to approve');
      if (onSuccess) onSuccess();
    } catch (err) {
      alert('Failed to approve question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleApprove}
      disabled={loading}
      style={{
        padding: '0.4rem 0.85rem',
        borderRadius: '6px',
        border: 'none',
        background: '#16a34a',
        color: '#ffffff',
        fontWeight: 600,
        fontSize: '0.85rem',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}
    >
      ✓ {loading ? 'Approving...' : 'Approve Question'}
    </button>
  );
}
