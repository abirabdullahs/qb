'use client';

import React, { useState, useEffect } from 'react';
import { BaseQuestionInput } from './question.schema';
import { MCQOptionInput } from './mcq.schema';
import { CQSubPartInput } from './cq.schema';
import MCQEditor from './MCQEditor';
import CQEditor from './CQEditor';
import WrittenEditor from './WrittenEditor';
import AttachmentManager, { AttachmentItem } from '../attachment/AttachmentManager';
import TagInput from '../tag/TagInput';
import type { SubjectItem } from '../academic/service';
import type { AdmissionExam } from '../admission/service';

interface QuestionFormProps {
  initialData?: any;
  onSubmit: (payload: any) => Promise<void>;
  isSubmitting?: boolean;
}

export default function QuestionForm({ initialData, onSubmit, isSubmitting = false }: QuestionFormProps) {
  const [branchType, setBranchType] = useState<'academic' | 'admission'>(initialData?.branchType || 'academic');

  // Academic Domain State
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [subjectId, setSubjectId] = useState<number>(initialData?.subjectId || 1);
  const [chapterId, setChapterId] = useState<number | undefined>(initialData?.chapterId);
  const [topicId, setTopicId] = useState<number | undefined>(initialData?.topicId);
  const [topicName, setTopicName] = useState<string>(initialData?.topicName || '');
  const [boards, setBoards] = useState<any[]>([]);
  const [selectedBoardIds, setSelectedBoardIds] = useState<number[]>(initialData?.boardIds || []);

  // Admission Domain State
  const [admissionSegments, setAdmissionSegments] = useState<any[]>([]);
  const [admissionExams, setAdmissionExams] = useState<AdmissionExam[]>([]);
  const [institutes, setInstitutes] = useState<any[]>([]);
  const [admissionSegmentId, setAdmissionSegmentId] = useState<number | undefined>(initialData?.admissionSegmentId);
  const [admissionExamId, setAdmissionExamId] = useState<number | undefined>(initialData?.admissionExamId);
  const [admissionUnitId, setAdmissionUnitId] = useState<number | undefined>(initialData?.admissionUnitId);
  const [instituteId, setInstituteId] = useState<number | undefined>(initialData?.instituteId);

  // Common Question Fields
  const [questionType, setQuestionType] = useState<'mcq' | 'cq' | 'written'>(initialData?.questionType || 'mcq');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(initialData?.difficulty || 'medium');
  const [year, setYear] = useState<number | undefined>(initialData?.year || 2025);
  const [examName, setExamName] = useState<string>(initialData?.examName || '');
  const [marks, setMarks] = useState<number>(initialData?.marks || 1);

  // Editors Content
  const [questionText, setQuestionText] = useState<string>(initialData?.questionText || '');
  const [stimulusText, setStimulusText] = useState<string>(initialData?.stimulusText || '');
  const [answerText, setAnswerText] = useState<string>(initialData?.answerText || '');
  const [explanationText, setExplanationText] = useState<string>(initialData?.explanationText || '');

  // Options & Subparts
  const [options, setOptions] = useState<MCQOptionInput[]>(
    initialData?.options || [
      { optionLabel: 'ক', optionText: '', isCorrect: true, orderNo: 1 },
      { optionLabel: 'খ', optionText: '', isCorrect: false, orderNo: 2 },
      { optionLabel: 'গ', optionText: '', isCorrect: false, orderNo: 3 },
      { optionLabel: 'ঘ', optionText: '', isCorrect: false, orderNo: 4 },
    ]
  );

  const [subParts, setSubParts] = useState<CQSubPartInput[]>(
    initialData?.subParts || [
      { partLabel: 'ক', partText: '', marks: 1, cognitiveLevel: 'knowledge', orderNo: 1 },
      { partLabel: 'খ', partText: '', marks: 2, cognitiveLevel: 'comprehension', orderNo: 2 },
      { partLabel: 'গ', partText: '', marks: 3, cognitiveLevel: 'application', orderNo: 3 },
      { partLabel: 'ঘ', partText: '', marks: 4, cognitiveLevel: 'higher_ability', orderNo: 4 },
    ]
  );

  const [attachments, setAttachments] = useState<AttachmentItem[]>(initialData?.attachments || []);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadAcademic() {
      try {
        const res = await fetch('/api/academic/tree');
        if (res.ok) {
          const json = await res.json();
          setSubjects(json.data || json || []);
        }
      } catch (err) {
        console.error('Failed to load academic tree:', err);
        setSubjects([]);
      }

      try {
        const res = await fetch('/api/academic/boards');
        if (res.ok) {
          const json = await res.json();
          setBoards(json.data || json || []);
        }
      } catch (err) {
        console.error('Failed to load boards:', err);
        setBoards([]);
      }
    }

    async function loadAdmission() {
      try {
        const segRes = await fetch('/api/admission/segments');
        if (segRes.ok) {
          const json = await segRes.json();
          setAdmissionSegments(json.data || json || []);
        }
      } catch (err) {
        console.error('Failed to load admission segments:', err);
        setAdmissionSegments([]);
      }

      try {
        const exRes = await fetch('/api/admission/exams');
        if (exRes.ok) {
          const json = await exRes.json();
          setAdmissionExams(json.data || json || []);
        }
      } catch (err) {
        console.error('Failed to load admission exams:', err);
        setAdmissionExams([]);
      }

      try {
        const instRes = await fetch('/api/admission/institutes');
        if (instRes.ok) {
          const json = await instRes.json();
          setInstitutes(json.data || json || []);
        }
      } catch (err) {
        console.error('Failed to load institutes:', err);
        setInstitutes([]);
      }
    }

    loadAcademic();
    loadAdmission();
  }, []);

  const currentSubject = subjects.find((s) => s.id === subjectId);
  const currentChapter = currentSubject?.chapters?.find((c) => c.id === chapterId);
  const currentExam = admissionExams.find((e) => e.id === admissionExamId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (questionType === 'mcq' && !questionText) {
      setErrorMsg('Question text is required for MCQ');
      return;
    }

    if (questionType === 'cq' && !stimulusText) {
      setErrorMsg('Stimulus text (উদ্দীপক) is required for CQ');
      return;
    }

    const payload = {
      branchType,
      subjectId,
      chapterId: branchType === 'academic' ? chapterId : undefined,
      topicId: branchType === 'academic' ? topicId : undefined,
      topicName: branchType === 'academic' && topicName.trim() ? topicName.trim() : undefined,
      segmentId: branchType === 'academic' ? 1 : undefined,
      admissionSegmentId: branchType === 'admission' ? admissionSegmentId : undefined,
      admissionExamId: branchType === 'admission' ? admissionExamId : undefined,
      admissionUnitId: branchType === 'admission' ? admissionUnitId : undefined,
      instituteId: branchType === 'admission' ? instituteId : undefined,
      questionType,
      difficulty,
      year: year || undefined,
      examName: examName || undefined,
      marks: questionType === 'cq' ? subParts.reduce((acc, c) => acc + (c.marks || 0), 0) : marks,
      questionText: questionType === 'cq' ? 'সৃজনশীল প্রশ্ন' : questionText,
      stimulusText: questionType === 'cq' ? stimulusText : undefined,
      answerText: questionType === 'written' ? answerText : undefined,
      explanationText: questionType !== 'cq' ? explanationText : undefined,
      options: questionType === 'mcq' ? options : undefined,
      subParts: questionType === 'cq' ? subParts : undefined,
      boardIds: selectedBoardIds,
      attachments,
      tags,
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit question');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {errorMsg && (
        <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.9rem' }}>
          {errorMsg}
        </div>
      )}

      {/* Branch Selection */}
      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
          1. Category & Curriculum Branch
        </h4>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <label style={{ cursor: 'pointer', fontWeight: 600, color: branchType === 'academic' ? '#2563eb' : '#64748b' }}>
            <input
              type="radio"
              name="branchType"
              checked={branchType === 'academic'}
              onChange={() => setBranchType('academic')}
              style={{ marginRight: '0.4rem' }}
            />
            Academic Curriculum (HSC/SSC)
          </label>
          <label style={{ cursor: 'pointer', fontWeight: 600, color: branchType === 'admission' ? '#2563eb' : '#64748b' }}>
            <input
              type="radio"
              name="branchType"
              checked={branchType === 'admission'}
              onChange={() => setBranchType('admission')}
              style={{ marginRight: '0.4rem' }}
            />
            Admission Exam Branch (BUET / Medical / Varsity Cluster)
          </label>
        </div>
      </div>

      {/* Academic Taxonomy Selectors */}
      {branchType === 'academic' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label className="form-label">Subject (বিষয়) *</label>
            <select
              className="form-input"
              value={subjectId}
              onChange={(e) => {
                setSubjectId(Number(e.target.value));
                setChapterId(undefined);
                setTopicId(undefined);
                setTopicName('');
              }}
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Chapter (অধ্যায়)</label>
            <select
              className="form-input"
              value={chapterId || ''}
              onChange={(e) => {
                setChapterId(e.target.value ? Number(e.target.value) : undefined);
                setTopicId(undefined);
                setTopicName('');
              }}
            >
              <option value="">-- Select Chapter --</option>
              {currentSubject?.chapters?.map((chap) => (
                <option key={chap.id} value={chap.id}>
                  {chap.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Topic (টপিক)</label>
            <select
              className="form-input"
              value={topicId || ''}
              disabled={!chapterId}
              onChange={(e) => setTopicId(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">-- Select Existing Topic --</option>
              {currentChapter?.topics?.map((top) => (
                <option key={top.id} value={top.id}>
                  {top.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">New Topic Name (optional)</label>
            <input
              className="form-input"
              value={topicName}
              disabled={!chapterId}
              placeholder="Type a new topic name to create it automatically"
              onChange={(e) => setTopicName(e.target.value)}
            />
          </div>
        </div>
      ) : (
        /* Admission Branch Selectors */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label className="form-label">Admission Segment</label>
            <select
              className="form-input"
              value={admissionSegmentId || ''}
              onChange={(e) => setAdmissionSegmentId(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">-- Select Segment --</option>
              {admissionSegments.map((seg) => (
                <option key={seg.id} value={seg.id}>
                  {seg.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Admission Exam</label>
            <select
              className="form-input"
              value={admissionExamId || ''}
              onChange={(e) => {
                setAdmissionExamId(e.target.value ? Number(e.target.value) : undefined);
                setAdmissionUnitId(undefined);
              }}
            >
              <option value="">-- Select Exam --</option>
              {admissionExams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.examType})
                </option>
              ))}
            </select>
          </div>

          {currentExam?.units && currentExam.units.length > 0 && (
            <div>
              <label className="form-label">Admission Unit</label>
              <select
                className="form-input"
                value={admissionUnitId || ''}
                onChange={(e) => setAdmissionUnitId(e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">-- Select Unit --</option>
                {currentExam.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.unitName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="form-label">Target Institute</label>
            <select
              className="form-input"
              value={instituteId || ''}
              onChange={(e) => setInstituteId(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">-- Select Institute --</option>
              {institutes.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.shortName})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Question Metadata */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        <div>
          <label className="form-label">Question Type</label>
          <select
            className="form-input"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value as any)}
          >
            <option value="mcq">MCQ (বহুনির্বাচনী)</option>
            <option value="cq">CQ (সৃজনশীল)</option>
            <option value="written">Written (রচনামূলক)</option>
          </select>
        </div>

        <div>
          <label className="form-label">Difficulty Level</label>
          <select
            className="form-input"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
          >
            <option value="easy">Easy (সহজ)</option>
            <option value="medium">Medium (মধ্যম)</option>
            <option value="hard">Hard (কঠিন)</option>
          </select>
        </div>

        <div>
          <label className="form-label">Year</label>
          <input
            type="number"
            className="form-input"
            value={year || ''}
            onChange={(e) => setYear(parseInt(e.target.value) || undefined)}
            placeholder="e.g. 2025"
          />
        </div>

        <div>
          <label className="form-label">Exam Name / Tag</label>
          <input
            type="text"
            className="form-input"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="e.g. Board Exam 2025"
          />
        </div>
      </div>

      {/* Question Type Specific Editor */}
      <div style={{ background: '#ffffff', padding: '1.25rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
        {questionType === 'mcq' && (
          <MCQEditor
            questionText={questionText}
            onQuestionTextChange={setQuestionText}
            options={options}
            onOptionsChange={setOptions}
            explanationText={explanationText}
            onExplanationChange={setExplanationText}
          />
        )}

        {questionType === 'cq' && (
          <CQEditor
            stimulusText={stimulusText}
            onStimulusChange={setStimulusText}
            subParts={subParts}
            onSubPartsChange={setSubParts}
          />
        )}

        {questionType === 'written' && (
          <WrittenEditor
            questionText={questionText}
            onQuestionTextChange={setQuestionText}
            answerText={answerText}
            onAnswerTextChange={setAnswerText}
            explanationText={explanationText}
            onExplanationChange={setExplanationText}
            marks={marks}
            onMarksChange={setMarks}
          />
        )}
      </div>

      <div style={{ background: '#ffffff', padding: '1.25rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
        <AttachmentManager
          attachments={attachments}
          onChange={setAttachments}
          attachableType="question"
        />
      </div>

      <div style={{ background: '#ffffff', padding: '1.25rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
        {isSubmitting ? 'Saving Question...' : 'Save & Publish Question'}
      </button>
    </form>
  );
}
