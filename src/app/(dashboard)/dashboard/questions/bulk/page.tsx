'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const SAMPLE_JSON_TEMPLATE = [
  {
    "segmentId": 1,
    "subjectId": 1,
    "chapterId": 1,
    "questionType": "mcq",
    "questionText": "What is the acceleration due to gravity on Earth's surface?",
    "difficulty": "easy",
    "language": "en",
    "explanationText": "Standard acceleration due to gravity is approximately 9.8 m/s².",
    "options": [
      { "optionLabel": "A", "optionText": "9.8 m/s²", "isCorrect": true },
      { "optionLabel": "B", "optionText": "8.9 m/s²", "isCorrect": false },
      { "optionLabel": "C", "optionText": "10.5 m/s²", "isCorrect": false },
      { "optionLabel": "D", "optionText": "9.0 m/s²", "isCorrect": false }
    ],
    "tags": ["Physics", "Gravity"]
  },
  {
    "segmentId": 1,
    "subjectId": 1,
    "chapterId": 1,
    "questionType": "cq",
    "stimulusText": "A car accelerates uniformly from rest at 2 m/s² for 10 seconds.",
    "questionText": "Solve the sub-questions based on the scenario.",
    "difficulty": "medium",
    "cqStyle": "hsc_standard",
    "subParts": [
      { "partLabel": "a", "partText": "Define uniform acceleration.", "marks": 1, "cognitive_level": "knowledge" },
      { "partLabel": "b", "partText": "Explain the relationship between acceleration and velocity.", "marks": 2, "cognitive_level": "comprehension" },
      { "partLabel": "c", "partText": "Calculate the final velocity after 10 seconds.", "marks": 3, "cognitive_level": "application", "answerText": "v = u + at = 0 + 2*10 = 20 m/s" },
      { "partLabel": "d", "partText": "Determine the total distance traveled during this time.", "marks": 4, "cognitive_level": "higher_ability", "answerText": "s = ut + 0.5*a*t² = 0 + 0.5*2*100 = 100 m" }
    ],
    "tags": ["Kinematics", "Motion"]
  }
];

export default function BulkUploadPage() {
  const [jsonText, setJsonText] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [summary, setSummary] = useState<any | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setFileError('Please select a valid .json file.');
      return;
    }

    setFileError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        JSON.parse(text); // validate syntax
        setJsonText(text);
      } catch (err: any) {
        setFileError(`Invalid JSON syntax in file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopySample = () => {
    setJsonText(JSON.stringify(SAMPLE_JSON_TEMPLATE, null, 2));
    setFileError(null);
  };

  const handleSubmitBulk = async () => {
    if (!jsonText.trim()) {
      setFileError('Please upload a JSON file or paste JSON data.');
      return;
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err: any) {
      setFileError(`JSON Syntax Error: ${err.message}`);
      return;
    }

    setUploading(true);
    setFileError(null);
    setSummary(null);

    try {
      const res = await fetch('/api/questions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Bulk upload failed');
      }

      setSummary(data.data);
    } catch (err: any) {
      setFileError(err.message || 'An error occurred during bulk upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link href="/dashboard/questions" style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
            &larr; Back to Question Repository
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0' }}>
            Bulk Question Upload (JSON Import)
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Import multiple MCQ, CQ, or Written questions at once using a structured JSON file.
          </p>
        </div>

        <button
          onClick={handleCopySample}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          Load Sample JSON Template
        </button>
      </div>

      {fileError && (
        <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <strong>Error:</strong> {fileError}
        </div>
      )}

      {/* File Upload & Input Area */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label" style={{ fontWeight: 700 }}>Select .JSON File to Import</label>
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            style={{ display: 'block', width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label" style={{ fontWeight: 700 }}>Or Paste JSON Content Directly</label>
          <textarea
            rows={12}
            className="form-input"
            style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.4 }}
            placeholder="Paste your JSON array of questions here..."
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setFileError(null);
            }}
          />
        </div>

        <button
          onClick={handleSubmitBulk}
          disabled={uploading || !jsonText.trim()}
          className="btn btn-primary"
          style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 700 }}
        >
          {uploading ? 'Processing Bulk Upload...' : 'Upload & Process Questions'}
        </button>
      </div>

      {/* Upload Results Summary */}
      {summary && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            Upload Results Summary
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>TOTAL PROCESSED</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{summary.total}</div>
            </div>
            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>SUCCESSFUL</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>{summary.createdCount}</div>
            </div>
            <div style={{ background: '#fefce8', padding: '1rem', borderRadius: '8px', border: '1px solid #fef08a', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#854d0e', fontWeight: 600 }}>DUPLICATES</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a16207' }}>{summary.duplicateCount}</div>
            </div>
            <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '1px solid #fca5a5', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 600 }}>ERRORS</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b91c1c' }}>{summary.errorCount}</div>
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem' }}>Detailed Status</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.6rem 1rem' }}>#</th>
                  <th style={{ padding: '0.6rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.6rem 1rem' }}>Question ID / Warning</th>
                </tr>
              </thead>
              <tbody>
                {summary.results?.map((res: any) => (
                  <tr key={res.index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 600 }}>Item {res.index + 1}</td>
                    <td style={{ padding: '0.6rem 1rem' }}>
                      {res.success ? (
                        <span style={{ color: '#15803d', fontWeight: 700 }}>
                          ✓ Success {res.isDuplicate ? '(Duplicate Hash)' : ''}
                        </span>
                      ) : (
                        <span style={{ color: '#b91c1c', fontWeight: 700 }}>✗ Failed</span>
                      )}
                    </td>
                    <td style={{ padding: '0.6rem 1rem', color: res.error ? '#b91c1c' : '#475569' }}>
                      {res.success ? `ID: ${res.id}` : res.error}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
