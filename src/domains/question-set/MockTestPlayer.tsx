'use client';

import React, { useState, useEffect } from 'react';
import { QuestionSetRecord } from './question-set.repository';
import LatexRenderer from '../content/LatexRenderer';
import ImagePreview from '../attachment/ImagePreview';

interface MockTestPlayerProps {
  questionSet: QuestionSetRecord;
}

export default function MockTestPlayer({ questionSet }: MockTestPlayerProps) {
  const items = questionSet.items || [];
  const totalQuestions = items.length;
  const negativeRatio = Number(questionSet.negativeMarking) || 0;

  // Selected options map: { [questionId]: optionLabel }
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(totalQuestions * 90); // 90 sec per question
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeRemaining]);

  const handleSelectOption = (questionId: number, optionLabel: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionLabel,
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Score Calculation
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;
  let totalScore = 0;

  items.forEach((item) => {
    const q = item.question;
    if (!q) return;
    const selected = selectedAnswers[q.id];

    if (!selected) {
      unattemptedCount++;
    } else {
      const correctOpt = q.options?.find((o: any) => o.isCorrect);
      if (correctOpt && correctOpt.optionLabel === selected) {
        correctCount++;
        totalScore += Number(item.marksOverride || q.marks || 1);
      } else {
        wrongCount++;
        totalScore -= negativeRatio;
      }
    }
  });

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Test Header */}
      <div
        style={{
          background: '#ffffff',
          padding: '1.25rem',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          position: 'sticky',
          top: '1rem',
          zIndex: 10,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {questionSet.name}
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
            Questions: {totalQuestions} | Negative Penalty: {negativeRatio} marks/wrong
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!isSubmitted ? (
            <div
              style={{
                background: timeRemaining < 60 ? '#fee2e2' : '#f1f5f9',
                color: timeRemaining < 60 ? '#dc2626' : '#1e293b',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '1.1rem',
              }}
            >
              ⏱️ {formatTime(timeRemaining)}
            </div>
          ) : (
            <div
              style={{
                background: '#dcfce7',
                color: '#15803d',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontWeight: 700,
              }}
            >
              Submitted
            </div>
          )}

          {!isSubmitted && (
            <button
              type="button"
              onClick={() => setIsSubmitted(true)}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.9rem' }}
            >
              Submit Exam
            </button>
          )}
        </div>
      </div>

      {/* Result Card if Submitted */}
      {isSubmitted && (
        <div
          style={{
            background: '#ffffff',
            padding: '1.5rem',
            borderRadius: '10px',
            border: '2px solid #2563eb',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            📊 Exam Performance Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Score</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: totalScore >= 0 ? '#16a34a' : '#dc2626' }}>
                {totalScore.toFixed(2)}
              </div>
            </div>

            <div style={{ background: '#f0fdf4', padding: '0.85rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#166534' }}>Correct</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>{correctCount}</div>
            </div>

            <div style={{ background: '#fef2f2', padding: '0.85rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#991b1b' }}>Wrong</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>{wrongCount}</div>
            </div>

            <div style={{ background: '#f1f5f9', padding: '0.85rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#475569' }}>Unattempted</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#475569' }}>{unattemptedCount}</div>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {items.map((item, idx) => {
          const q = item.question;
          if (!q) return null;
          const selected = selectedAnswers[q.id];

          return (
            <div
              key={q.id}
              style={{
                background: '#ffffff',
                padding: '1.25rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>
                <span style={{ color: '#2563eb', marginRight: '0.4rem' }}>{idx + 1}.</span>
                <LatexRenderer content={q.questionText} />
              </div>

              {q.attachments && q.attachments.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {q.attachments.map((att: any, aIdx: number) => (
                    <ImagePreview key={aIdx} url={att.imageUrl || att.url} width="220px" />
                  ))}
                </div>
              )}

              {/* Options */}
              {q.options && q.options.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem' }}>
                  {q.options.map((opt: any, oIdx: number) => {
                    const isPicked = selected === opt.optionLabel;
                    const isCorrect = opt.isCorrect;

                    let optionBorder = '1px solid #cbd5e1';
                    let optionBg = '#ffffff';

                    if (isSubmitted) {
                      if (isCorrect) {
                        optionBorder = '2px solid #16a34a';
                        optionBg = '#f0fdf4';
                      } else if (isPicked && !isCorrect) {
                        optionBorder = '2px solid #dc2626';
                        optionBg = '#fef2f2';
                      }
                    } else if (isPicked) {
                      optionBorder = '2px solid #2563eb';
                      optionBg = '#eff6ff';
                    }

                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleSelectOption(q.id, opt.optionLabel)}
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: '6px',
                          border: optionBorder,
                          background: optionBg,
                          cursor: isSubmitted ? 'default' : 'pointer',
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
                            background: isPicked ? '#2563eb' : '#e2e8f0',
                            color: isPicked ? '#ffffff' : '#475569',
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
                    );
                  })}
                </div>
              )}

              {/* Solution details after submission */}
              {isSubmitted && q.explanationText && (
                <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '6px', fontSize: '0.875rem', color: '#1e3a8a' }}>
                  <strong>Explanation: </strong> <LatexRenderer content={q.explanationText} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
