'use client';

import React, { useState } from 'react';
import { FullQuestion } from './question.repository';
import LatexRenderer from '../content/LatexRenderer';
import ImagePreview from '../attachment/ImagePreview';

interface QuestionRendererProps {
  question: FullQuestion;
  showAnswerByDefault?: boolean;
}

export default function QuestionRenderer({ question, showAnswerByDefault = false }: QuestionRendererProps) {
  const [showAnswer, setShowAnswer] = useState(showAnswerByDefault);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Stimulus if available (CQ or passage) */}
      {question.stimulusText && (
        <div
          style={{
            padding: '0.85rem',
            background: '#f8fafc',
            borderLeft: '4px solid #2563eb',
            borderRadius: '0 6px 6px 0',
            fontSize: '0.95rem',
            color: '#334155',
          }}
        >
          <strong style={{ color: '#1e293b', display: 'block', marginBottom: '0.3rem' }}>উদ্দীপক (Stimulus):</strong>
          <LatexRenderer content={question.stimulusText} />
        </div>
      )}

      {/* Primary Question Text */}
      <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.5 }}>
        <LatexRenderer content={question.questionText} />
      </div>

      {/* Attachments / Diagrams */}
      {question.attachments && question.attachments.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
          {question.attachments.map((att: any, idx: number) => (
            <ImagePreview
              key={idx}
              url={att.imageUrl || att.url}
              altText={att.altText || `Diagram ${idx + 1}`}
              width="260px"
            />
          ))}
        </div>
      )}

      {/* MCQ Options Rendering */}
      {question.questionType === 'mcq' && question.options && question.options.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem', marginTop: '0.5rem' }}>
          {question.options.map((opt, i) => (
            <div
              key={i}
              style={{
                padding: '0.6rem 0.85rem',
                borderRadius: '6px',
                border: showAnswer && opt.isCorrect ? '2px solid #16a34a' : '1px solid #cbd5e1',
                background: showAnswer && opt.isCorrect ? '#f0fdf4' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.9rem',
              }}
            >
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: showAnswer && opt.isCorrect ? '#16a34a' : '#e2e8f0',
                  color: showAnswer && opt.isCorrect ? '#ffffff' : '#475569',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  flexShrink: 0,
                }}
              >
                {opt.optionLabel}
              </span>
              <div style={{ flex: 1 }}>
                <LatexRenderer content={opt.optionText} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CQ Sub-parts Rendering */}
      {question.questionType === 'cq' && question.subParts && question.subParts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          {question.subParts.map((sp, i) => (
            <div
              key={i}
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700, color: '#2563eb' }}>({sp.partLabel})</span>
                <span style={{ color: '#64748b' }}>[{sp.marks} mark{Number(sp.marks) > 1 ? 's' : ''}]</span>
              </div>
              <div style={{ fontSize: '0.95rem', color: '#1e293b' }}>
                <LatexRenderer content={sp.partText} />
              </div>
              {showAnswer && sp.answerText && (
                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #cbd5e1', color: '#16a34a', fontSize: '0.9rem' }}>
                  <strong>উত্তর: </strong> <LatexRenderer content={sp.answerText} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toggle Answer / Solution */}
      <div>
        <button
          type="button"
          onClick={() => setShowAnswer(!showAnswer)}
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
        >
          {showAnswer ? 'Hide Solution' : 'Show Solution & Explanation'}
        </button>
      </div>

      {showAnswer && (question.answerText || question.explanationText) && (
        <div style={{ padding: '0.85rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.9rem', color: '#1e3a8a' }}>
          {question.answerText && (
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Answer: </strong> <LatexRenderer content={question.answerText} />
            </div>
          )}
          {question.explanationText && (
            <div>
              <strong>Explanation: </strong> <LatexRenderer content={question.explanationText} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
