'use client';

import { useState, useEffect } from 'react';
import { BookOpen, FolderPlus, Plus, ChevronRight, ChevronDown, Layers } from 'lucide-react';

interface Topic {
  id: number;
  name: string;
}

interface Chapter {
  id: number;
  name: string;
  topics?: Topic[];
}

interface Subject {
  id: number;
  name: string;
  code?: string;
  chapters?: Chapter[];
}

export default function TaxonomyPage() {
  const [tree, setTree] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSubjects, setExpandedSubjects] = useState<Record<number, boolean>>({});
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({});

  // Forms
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [newChapterName, setNewChapterName] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [newTopicName, setNewTopicName] = useState('');

  const fetchTree = async () => {
    try {
      const res = await fetch('/api/academic/tree');
      const data = await res.json();
      if (data.success && data.data) {
        setTree(data.data);
        // Expand first subject by default
        if (data.data[0]) {
          setExpandedSubjects({ [data.data[0].id]: true });
          if (data.data[0].chapters?.[0]) {
            setExpandedChapters({ [data.data[0].chapters[0].id]: true });
          }
        }
      }
    } catch (err) {
      console.error('Failed to load curriculum tree:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    try {
      const res = await fetch('/api/academic/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubjectName }),
      });
      const data = await res.json();
      if (data.success) {
        setNewSubjectName('');
        fetchTree();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !newChapterName.trim()) return;
    try {
      const res = await fetch('/api/academic/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId: selectedSubjectId, name: newChapterName }),
      });
      const data = await res.json();
      if (data.success) {
        setNewChapterName('');
        fetchTree();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChapterId || !newTopicName.trim()) return;
    try {
      const res = await fetch('/api/academic/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: selectedChapterId, name: newTopicName }),
      });
      const data = await res.json();
      if (data.success) {
        setNewTopicName('');
        fetchTree();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSubject = (id: number) => {
    setExpandedSubjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleChapter = (id: number) => {
    setExpandedChapters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Academic Curriculum Taxonomy</h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Manage Subjects, Chapters, and Topics hierarchy for academic questions (SSC / HSC).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Curriculum Tree View */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} color="#2563eb" />
            <span>Curriculum Hierarchy</span>
          </h2>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading taxonomy tree...</div>
          ) : tree.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No subjects added yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tree.map((subject) => {
                const isSubExpanded = expandedSubjects[subject.id];
                return (
                  <div key={subject.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <div
                      onClick={() => toggleSubject(subject.id)}
                      style={{
                        padding: '0.75rem 1rem',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isSubExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        <span>{subject.name}</span>
                        {subject.code && <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>{subject.code}</span>}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {subject.chapters?.length || 0} Chapters
                      </span>
                    </div>

                    {isSubExpanded && (
                      <div style={{ padding: '0.75rem 1rem 0.75rem 2rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {subject.chapters?.length === 0 ? (
                          <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>No chapters added to this subject.</div>
                        ) : (
                          subject.chapters?.map((chapter) => {
                            const isChapExpanded = expandedChapters[chapter.id];
                            return (
                              <div key={chapter.id} style={{ borderLeft: '2px solid #cbd5e1', paddingLeft: '0.75rem' }}>
                                <div
                                  onClick={() => toggleChapter(chapter.id)}
                                  style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: '#334155',
                                    padding: '0.25rem 0',
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    {isChapExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    <span>{chapter.name}</span>
                                  </div>
                                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                    {chapter.topics?.length || 0} Topics
                                  </span>
                                </div>

                                {isChapExpanded && (
                                  <div style={{ paddingLeft: '1.25rem', marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    {chapter.topics?.length === 0 ? (
                                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No topics added.</div>
                                    ) : (
                                      chapter.topics?.map((topic) => (
                                        <div key={topic.id} style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb' }} />
                                          <span>{topic.name}</span>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Panel / Create Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Add Subject */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} color="#2563eb" />
              <span>Add Subject</span>
            </h3>
            <form onSubmit={handleAddSubject}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. উচ্চতর গণিত ২য় পত্র"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Create Subject
              </button>
            </form>
          </div>

          {/* Add Chapter */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FolderPlus size={16} color="#10b981" />
              <span>Add Chapter</span>
            </h3>
            <form onSubmit={handleAddChapter}>
              <div className="form-group">
                <label className="form-label">Parent Subject</label>
                <select
                  className="form-select"
                  value={selectedSubjectId || ''}
                  onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                  required
                >
                  <option value="">Select Subject</option>
                  {tree.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Chapter Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. অধ্যায় ৪: বহুপদী ও বহুপদী সমীকরণ"
                  value={newChapterName}
                  onChange={(e) => setNewChapterName(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#10b981' }}>
                Create Chapter
              </button>
            </form>
          </div>

          {/* Add Topic */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} color="#9333ea" />
              <span>Add Topic</span>
            </h3>
            <form onSubmit={handleAddTopic}>
              <div className="form-group">
                <label className="form-label">Parent Chapter</label>
                <select
                  className="form-select"
                  value={selectedChapterId || ''}
                  onChange={(e) => setSelectedChapterId(Number(e.target.value))}
                  required
                >
                  <option value="">Select Chapter</option>
                  {tree.flatMap((s) =>
                    (s.chapters || []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {s.name} &rarr; {c.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Topic Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. দ্বিঘাত সমীকরণের মূলের প্রকৃতি"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#9333ea' }}>
                Create Topic
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
