'use client';

import { useState, useEffect } from 'react';
import { BookOpen, FolderPlus, Plus, ChevronRight, ChevronDown, Layers, Sparkles, Edit3, Check, X } from 'lucide-react';
import LatexRenderer from '@/components/content/LatexRenderer';

interface Topic {
  id: number;
  name: string;
  concept?: string | null;
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
  const [newTopicConcept, setNewTopicConcept] = useState('');

  // Editing existing concept
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
  const [editingConceptText, setEditingConceptText] = useState('');

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
        body: JSON.stringify({
          chapterId: selectedChapterId,
          name: newTopicName,
          concept: newTopicConcept,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewTopicName('');
        setNewTopicConcept('');
        fetchTree();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveConcept = async (topicId: number) => {
    try {
      const res = await fetch('/api/academic/topics', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, concept: editingConceptText }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingTopicId(null);
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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Academic Curriculum Taxonomy</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Manage Subjects, Chapters, Topics, and Core Academic Concepts with LaTeX Math Rendering.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Curriculum Tree View */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} color="var(--color-primary)" />
            <span>Curriculum Hierarchy</span>
          </h2>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading taxonomy tree...</div>
          ) : tree.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No subjects added yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tree.map((subject) => {
                const isSubExpanded = expandedSubjects[subject.id];
                return (
                  <div key={subject.id} style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div
                      onClick={() => toggleSubject(subject.id)}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'var(--color-bg-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isSubExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        <span>{subject.name}</span>
                        {subject.code && <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>{subject.code}</span>}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {subject.chapters?.length || 0} Chapters
                      </span>
                    </div>

                    {isSubExpanded && (
                      <div style={{ padding: '0.75rem 1rem 0.75rem 2rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {subject.chapters?.length === 0 ? (
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No chapters added to this subject.</div>
                        ) : (
                          subject.chapters?.map((chapter) => {
                            const isChapExpanded = expandedChapters[chapter.id];
                            return (
                              <div key={chapter.id} style={{ borderLeft: '2px solid var(--color-accent)', paddingLeft: '0.75rem' }}>
                                <div
                                  onClick={() => toggleChapter(chapter.id)}
                                  style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text-primary)',
                                    padding: '0.25rem 0',
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    {isChapExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    <span>{chapter.name}</span>
                                  </div>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                    {chapter.topics?.length || 0} Topics
                                  </span>
                                </div>

                                {isChapExpanded && (
                                  <div style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    {chapter.topics?.length === 0 ? (
                                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>No topics added.</div>
                                    ) : (
                                      chapter.topics?.map((topic) => (
                                        <div
                                          key={topic.id}
                                          style={{
                                            padding: '0.6rem 0.85rem',
                                            borderRadius: '8px',
                                            background: '#F8FAF7',
                                            border: '1px solid var(--color-border)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.4rem',
                                          }}
                                        >
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                                              <span>{topic.name}</span>
                                            </div>

                                            <button
                                              type="button"
                                              onClick={() => {
                                                if (editingTopicId === topic.id) {
                                                  setEditingTopicId(null);
                                                } else {
                                                  setEditingTopicId(topic.id);
                                                  setEditingConceptText(topic.concept || '');
                                                }
                                              }}
                                              style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--color-primary)',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.2rem',
                                              }}
                                            >
                                              <Edit3 size={13} />
                                              <span>{topic.concept ? 'Edit Concept' : '+ Add Concept'}</span>
                                            </button>
                                          </div>

                                          {/* Concept display or editor */}
                                          {editingTopicId === topic.id ? (
                                            <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                              <textarea
                                                className="form-input"
                                                rows={3}
                                                placeholder="Enter topic concept (plain text or LaTeX like $E=mc^2$)"
                                                value={editingConceptText}
                                                onChange={(e) => setEditingConceptText(e.target.value)}
                                                style={{ fontSize: '0.85rem' }}
                                              />
                                              {editingConceptText && (
                                                <div style={{ padding: '0.5rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.85rem' }}>
                                                  <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#15803D', marginBottom: '0.2rem' }}>LaTeX Live Preview:</div>
                                                  <LatexRenderer content={editingConceptText} />
                                                </div>
                                              )}
                                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button
                                                  type="button"
                                                  onClick={() => setEditingTopicId(null)}
                                                  className="btn btn-secondary"
                                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                >
                                                  <X size={14} /> Cancel
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() => handleSaveConcept(topic.id)}
                                                  className="btn btn-primary"
                                                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                                                >
                                                  <Check size={14} /> Save Concept
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            topic.concept && (
                                              <div style={{ padding: '0.5rem 0.75rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.825rem', color: '#166534' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, fontSize: '0.75rem', color: '#15803D', marginBottom: '0.2rem' }}>
                                                  <Sparkles size={12} />
                                                  <span>Concept (মৌলিক ধারণা):</span>
                                                </div>
                                                <LatexRenderer content={topic.concept} />
                                              </div>
                                            )
                                          )}
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
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} color="var(--color-primary)" />
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
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FolderPlus size={16} color="var(--color-primary)" />
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

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Create Chapter
              </button>
            </form>
          </div>

          {/* Add Topic with Concept */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} color="var(--color-primary)" />
              <span>Add Topic with Concept</span>
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

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={14} color="#15803D" />
                  <span>Topic Concept (Plain Text & LaTeX)</span>
                </label>
                <textarea
                  rows={3}
                  className="form-input"
                  placeholder="e.g. মূলদ্বয়ের নিশ্চায়ক $D = b^2 - 4ac$। $D > 0$ হলে মূলদ্বয় বাস্তব ও অসমান।"
                  value={newTopicConcept}
                  onChange={(e) => setNewTopicConcept(e.target.value)}
                />
              </div>

              {newTopicConcept && (
                <div style={{ marginBottom: '1rem', padding: '0.6rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#15803D', marginBottom: '0.2rem' }}>Live LaTeX Preview:</div>
                  <LatexRenderer content={newTopicConcept} />
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Create Topic
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
