'use client';

import React from 'react';

interface AttemptChartProps {
  totalQuestions: number;
  approvedQuestions: number;
  pendingQuestions: number;
  rejectedQuestions: number;
}

export default function AttemptChart({
  totalQuestions,
  approvedQuestions,
  pendingQuestions,
  rejectedQuestions,
}: AttemptChartProps) {
  const safeTotal = totalQuestions || 1;
  const approvedPct = Math.round((approvedQuestions / safeTotal) * 100);
  const pendingPct = Math.round((pendingQuestions / safeTotal) * 100);
  const rejectedPct = Math.round((rejectedQuestions / safeTotal) * 100);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          Question Bank Distribution
        </h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total: {totalQuestions}</span>
      </div>

      {/* Progress bar visualizer */}
      <div
        style={{
          height: '12px',
          borderRadius: '6px',
          background: 'var(--color-primary-light)',
          overflow: 'hidden',
          display: 'flex',
          width: '100%',
          border: '1px solid var(--color-border)',
        }}
      >
        <div
          style={{ width: `${approvedPct}%`, background: 'var(--color-success)', transition: 'width 0.3s' }}
          title={`Approved: ${approvedQuestions}`}
        />
        <div
          style={{ width: `${pendingPct}%`, background: 'var(--color-warning)', transition: 'width 0.3s' }}
          title={`Pending: ${pendingQuestions}`}
        />
        <div
          style={{ width: `${rejectedPct}%`, background: 'var(--color-danger)', transition: 'width 0.3s' }}
          title={`Rejected: ${rejectedQuestions}`}
        />
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-success)' }} />
          <span>Approved ({approvedQuestions})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-warning)' }} />
          <span>Pending ({pendingQuestions})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-danger)' }} />
          <span>Rejected ({rejectedQuestions})</span>
        </div>
      </div>
    </div>
  );
}
