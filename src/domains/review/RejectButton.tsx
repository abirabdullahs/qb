'use client';

import React, { useState } from 'react';

interface RejectButtonProps {
  questionId: number;
  onSuccess?: () => void;
}

export default function RejectButton({ questionId, onSuccess }: RejectButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this question submission?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });
      if (!res.ok) throw new Error('Failed to reject');
      if (onSuccess) onSuccess();
    } catch (err) {
      alert('Failed to reject question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleReject}
      disabled={loading}
      style={{
        padding: '0.4rem 0.85rem',
        borderRadius: '6px',
        border: 'none',
        background: '#dc2626',
        color: '#ffffff',
        fontWeight: 600,
        fontSize: '0.85rem',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}
    >
      ✕ {loading ? 'Rejecting...' : 'Reject Submission'}
    </button>
  );
}
