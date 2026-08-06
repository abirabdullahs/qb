'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SubjectItem, getCurriculumTree } from '@/domains/academic/service';
import { getAdmissionExams, getAdmissionSegments, AdmissionExam } from '@/domains/admission/service';
import { Layers, CheckCircle2, AlertCircle, FileCode, Upload, ArrowLeft, Info } from 'lucide-react';

const SAMPLE_JSON_TEMPLATE = [
  {
    "topicName": "ভৌত রাশি ও পরিমাপের ত্রুটি",
    "questionType": "mcq",
    "questionText": "What is the acceleration due to gravity on Earth's surface?",
    "difficulty": "easy",
    "language": "en",
    "explanationText": "Standard acceleration due to gravity is approximately 9.8 m/s².",
    "options": [
      { "optionLabel": "ক", "optionText": "9.8 m/s²", "isCorrect": true },
      { "optionLabel": "খ", "optionText": "8.9 m/s²", "isCorrect": false },
      { "optionLabel": "গ", "optionText": "10.5 m/s²", "isCorrect": false },
      { "optionLabel": "ঘ", "optionText": "9.0 m/s²", "isCorrect": false }
    ],
    "tags": ["Physics", "Gravity"]
  },
  {
    "topicName": "ভেক্টরের সামান্তরিক সূত্র",
    "questionType": "cq",
    "stimulusText": "একটি গাড়ি স্থির অবস্থান থেকে যাত্রা শুরু করে ২ মি/সে² সুষম তরণে ১০ সেকেন্ড চললো।",
    "questionText": "উদ্দীপকের আলোকে প্রশ্নগুলোর উত্তর দাও:",
    "difficulty": "medium",
    "cqStyle": "hsc_standard",
    "subParts": [
      { "partLabel": "ক", "partText": "সুষম ত্বরণ কাকে বলে?", "marks": 1, "cognitiveLevel": "knowledge" },
      { "partLabel": "খ", "partText": "ত্বরণ ও বেগের মধ্যে সম্পর্ক ব্যাখ্যা কর।", "marks": 2, "cognitiveLevel": "comprehension" },
      { "partLabel": "গ", "partText": "১০ সেকেন্ড পর গাড়িটির শেষ বেগ নির্ণয় কর।", "marks": 3, "cognitiveLevel": "application", "answerText": "v = u + at = 0 + 2*10 = 20 m/s" },
      { "partLabel": "ঘ", "partText": "গাড়িটির অতিক্রান্ত মোট দূরত্ব গানিতিকভাবে বিশ্লেষণ কর।", "marks": 4, "cognitiveLevel": "higher_ability", "answerText": "s = ut + 0.5*a*t² = 0 + 0.5*2*100 = 100 m" }
    ],
    "tags": ["Kinematics", "Motion"]
  }
];

export default function BulkUploadPage() {
  const [branchType, setBranchType] = useState<'academic' | 'admission'>('academic');
  
  // Academic Domain State
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [subjectId, setSubjectId] = useState<number | ''>('');
  const [chapterId, setChapterId] = useState<number | ''>('');
  const [topicId, setTopicId] = useState<number | ''>('');

  // Admission Domain State
  const [admissionSegments, setAdmissionSegments] = useState<any[]>([]);
  const [admissionExams, setAdmissionExams] = useState<AdmissionExam[]>([]);
  const [admissionSegmentId, setAdmissionSegmentId] = useState<number | ''>('');
  const [admissionExamId, setAdmissionExamId] = useState<number | ''>('');

  // Upload State
  const [jsonText, setJsonText] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [summary, setSummary] = useState<any | null>(null);
  const [currentUserDebug, setCurrentUserDebug] = useState<any | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/academic/tree');
        let tree: SubjectItem[] = [];
        if (res.ok) {
          const json = await res.json();
          tree = json.data || json || [];
        }
        if (!tree || tree.length === 0) {
          tree = await getCurriculumTree();
        }

        setSubjects(tree);
        if (tree.length > 0) {
          setSubjectId(tree[0].id);
          if (tree[0].chapters && tree[0].chapters.length > 0) {
            setChapterId(tree[0].chapters[0].id);
            if (tree[0].chapters[0].topics && tree[0].chapters[0].topics.length > 0) {
              setTopicId(tree[0].chapters[0].topics[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Error loading taxonomy tree:', err);
      }

      try {
        const segs = await getAdmissionSegments();
        setAdmissionSegments(segs);
        const exs = await getAdmissionExams();
        setAdmissionExams(exs);
      } catch (err) {
        console.error('Error loading admission data:', err);
      }
    }

    loadData();
  }, []);

  const currentSubject = subjects.find((s) => s.id === Number(subjectId));
  const currentChapter = currentSubject?.chapters?.find((c) => c.id === Number(chapterId));
  const currentTopic = currentChapter?.topics?.find((t) => t.id === Number(topicId));

  const handleSubjectChange = (newSubId: number) => {
    setSubjectId(newSubId);
    const sub = subjects.find((s) => s.id === newSubId);
    if (sub && sub.chapters && sub.chapters.length > 0) {
      setChapterId(sub.chapters[0].id);
      setTopicId('');
    } else {
      setChapterId('');
      setTopicId('');
    }
  };

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
    setFileError(null);

    // Validate upfront selection
    if (!subjectId) {
      setFileError('Please select a Target Subject before uploading questions.');
      return;
    }

    if (branchType === 'academic' && !chapterId) {
      setFileError('Please select a Target Chapter before uploading academic questions.');
      return;
    }

    if (!jsonText.trim()) {
      setFileError('Please upload a JSON file or paste JSON content.');
      return;
    }

    let rawQuestions: any;
    try {
      rawQuestions = JSON.parse(jsonText);
    } catch (err: any) {
      setFileError(`JSON Syntax Error: ${err.message}`);
      return;
    }

    let questionsArray: any[] = [];
    if (Array.isArray(rawQuestions)) {
      questionsArray = rawQuestions;
    } else if (rawQuestions && Array.isArray(rawQuestions.questions)) {
      questionsArray = rawQuestions.questions;
    } else {
      setFileError('Invalid JSON format. Expected an array of question objects e.g. [{ ... }, { ... }]');
      return;
    }

    if (questionsArray.length === 0) {
      setFileError('The JSON array contains no question items.');
      return;
    }

    // Automatically inject selected taxonomy fields into every question
    const enrichedQuestions = questionsArray.map((item: any) => {
      const topicName = typeof item.topicName === 'string'
        ? item.topicName.trim()
        : (typeof item.topic === 'string' ? item.topic.trim() : '');

      let resolvedTopicId: number | undefined;
      if (branchType === 'academic') {
        if (item.topicId) {
          resolvedTopicId = Number(item.topicId);
        } else if (topicName) {
          const selectedChapterTopics = currentSubject?.chapters?.find((c) => c.id === Number(chapterId))?.topics || [];
          const matchedTopic = selectedChapterTopics.find((t) => t.name.toLowerCase() === topicName.toLowerCase());

          if (matchedTopic) {
            resolvedTopicId = matchedTopic.id;
          } else {
            // Topic not found locally — leave topicId undefined and keep topicName
            // so the backend can `resolveOrCreateTopic` and create the topic if needed.
            resolvedTopicId = undefined;
          }
        } else if (topicId) {
          resolvedTopicId = Number(topicId);
        }
      }

      return {
        ...item,
        branchType,
        subjectId: item.subjectId ? Number(item.subjectId) : Number(subjectId),
        chapterId: branchType === 'academic' ? (item.chapterId ? Number(item.chapterId) : (chapterId ? Number(chapterId) : undefined)) : undefined,
        topicId: branchType === 'academic' ? resolvedTopicId : undefined,
        admissionSegmentId: branchType === 'admission' ? (item.admissionSegmentId ? Number(item.admissionSegmentId) : (admissionSegmentId ? Number(admissionSegmentId) : undefined)) : undefined,
        admissionExamId: branchType === 'admission' ? (item.admissionExamId ? Number(item.admissionExamId) : (admissionExamId ? Number(admissionExamId) : undefined)) : undefined,
      };
    });

    setUploading(true);
    setSummary(null);

    try {
      const res = await fetch('/api/questions/bulk', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrichedQuestions),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (res.status === 401) {
          throw new Error(data.error || 'Unauthorized - Please sign in to perform bulk upload');
        }
        throw new Error(data.error || 'Bulk upload failed');
      }

      setSummary(data.data);
    } catch (err: any) {
      setFileError(err.message || 'An error occurred during bulk upload');
    } finally {
      setUploading(false);
    }
  };

  const checkCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      const data = await res.json();
      setCurrentUserDebug({ status: res.status, body: data });
    } catch (err: any) {
      setCurrentUserDebug({ status: 'error', message: err.message });
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/dashboard/questions" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', marginBottom: '0.5rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Question Repository</span>
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
          Bulk Question Upload (JSON Import)
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Select the Subject and Chapter upfront. Questions in your JSON do not need subject or chapter IDs; you can use a topic name or topic ID.
        </p>
      </div>

      {fileError && (
        <div style={{ padding: '1rem', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#991B1B', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <div><strong>Error:</strong> {fileError}</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <button onClick={checkCurrentUser} className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}>
              Check Session
            </button>
          </div>
        </div>
      )}

        {currentUserDebug && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem' }}>
            <strong>Auth Debug:</strong>
            <pre style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>{JSON.stringify(currentUserDebug, null, 2)}</pre>
          </div>
        )}

      {/* STEP 1: Upfront Subject & Chapter Selector */}
      <div className="card" style={{ marginBottom: '1.5rem', background: '#F8FAFC', border: '1px solid #CBD5E1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
          <Layers size={20} color="var(--color-primary)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
            Step 1: Select Target Subject & Chapter
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700 }}>Curriculum Branch</label>
            <select
              className="form-select"
              value={branchType}
              onChange={(e) => setBranchType(e.target.value as 'academic' | 'admission')}
            >
              <option value="academic">Academic (SSC / HSC)</option>
              <option value="admission">Admission (BUET / DU / Medical)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700 }}>Target Subject *</label>
            <select
              className="form-select"
              value={subjectId}
              onChange={(e) => handleSubjectChange(Number(e.target.value))}
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {branchType === 'academic' ? (
            <>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Target Chapter *</label>
                <select
                  className="form-select"
                  value={chapterId}
                  onChange={(e) => {
                    setChapterId(e.target.value ? Number(e.target.value) : '');
                    setTopicId('');
                  }}
                  disabled={!subjectId}
                >
                  <option value="">-- Select Chapter --</option>
                  {currentSubject?.chapters?.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Topic (Optional)</label>
                <select
                  className="form-select"
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value ? Number(e.target.value) : '')}
                  disabled={!chapterId}
                >
                  <option value="">-- All Topics --</option>
                  {currentChapter?.topics?.map((top) => (
                    <option key={top.id} value={top.id}>
                      {top.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Admission Exam</label>
                <select
                  className="form-select"
                  value={admissionExamId}
                  onChange={(e) => setAdmissionExamId(e.target.value ? Number(e.target.value) : '')}
                >
                  <option value="">-- Select Exam --</option>
                  {admissionExams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} ({ex.examYear})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Target Destination Banner */}
        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#F0FDF4', border: '1px solid #A7F3D0', borderRadius: '8px', fontSize: '0.875rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <div>
            <strong>Selected Destination:</strong>{' '}
            {currentSubject ? currentSubject.name : 'No subject selected'}{' '}
            {currentChapter ? `➔ ${currentChapter.name}` : ''}{' '}
            {currentTopic ? `➔ (${currentTopic.name})` : ''}
          </div>
        </div>
      </div>

      {/* STEP 2: JSON Format & Upload */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCode size={20} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
              Step 2: Upload or Paste JSON Data
            </h2>
          </div>

          <button
            onClick={handleCopySample}
            type="button"
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            Load Sample Clean JSON Template
          </button>
        </div>

        {/* Clean JSON Notice */}
        <div style={{ padding: '0.75rem 1rem', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', fontSize: '0.85rem', color: '#1E3A8A', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <Info size={18} style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <strong>No IDs required in JSON!</strong> Every question item inside your JSON array will automatically be attached to the subject and chapter you selected above.
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label" style={{ fontWeight: 700 }}>Select .JSON File from Computer</label>
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            style={{ display: 'block', width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label" style={{ fontWeight: 700 }}>Or Paste Clean JSON Array Directly</label>
          <textarea
            rows={12}
            className="form-input"
            style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.4, background: '#1E293B', color: '#F8FAFC' }}
            placeholder="[ &#10;  { &#10;    &quot;questionType&quot;: &quot;mcq&quot;, &#10;    &quot;questionText&quot;: &quot;...&quot;, &#10;    &quot;options&quot;: [...] &#10;  } &#10;]"
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
          style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 700, minHeight: '46px' }}
        >
          <Upload size={18} />
          <span>{uploading ? 'Processing Bulk Upload...' : 'Upload & Process Questions'}</span>
        </button>
      </div>

      {/* Upload Results Summary */}
      {summary && (
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
            Upload Results Summary
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>TOTAL PROCESSED</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>{summary.total}</div>
            </div>
            <div style={{ background: '#F0FDF4', padding: '1rem', borderRadius: '8px', border: '1px solid #BBF7D0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>SUCCESSFUL</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803D' }}>{summary.createdCount}</div>
            </div>
            <div style={{ background: '#FEFCE8', padding: '1rem', borderRadius: '8px', border: '1px solid #FEF08A', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#854D0E', fontWeight: 600 }}>DUPLICATES</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#A16207' }}>{summary.duplicateCount}</div>
            </div>
            <div style={{ background: '#FEF2F2', padding: '1rem', borderRadius: '8px', border: '1px solid #FCA5A5', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#991B1B', fontWeight: 600 }}>ERRORS</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#B91C1C' }}>{summary.errorCount}</div>
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.75rem' }}>Detailed Status</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '0.6rem 1rem' }}>#</th>
                  <th style={{ padding: '0.6rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.6rem 1rem' }}>Question ID / Warning</th>
                </tr>
              </thead>
              <tbody>
                {summary.results?.map((res: any) => (
                  <tr key={res.index} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 600 }}>Item {res.index + 1}</td>
                    <td style={{ padding: '0.6rem 1rem' }}>
                      {res.success ? (
                        <span style={{ color: '#15803D', fontWeight: 700 }}>
                          ✓ Success {res.isDuplicate ? '(Duplicate Hash)' : ''}
                        </span>
                      ) : (
                        <span style={{ color: '#B91C1C', fontWeight: 700 }}>✗ Failed</span>
                      )}
                    </td>
                    <td style={{ padding: '0.6rem 1rem', color: res.error ? '#B91C1C' : 'var(--color-text-muted)' }}>
                      {res.success ? `Question ID: #${res.id}` : res.error}
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

