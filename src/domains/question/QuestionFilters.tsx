'use client';

import React, { useEffect, useState } from 'react';
import { QuestionQueryParams } from './question.queries';
import { SubjectItem } from '../academic/service';
import SearchBar from '../search/SearchBar';
import { TagRecord } from '../tag/tag.repository';

interface QuestionFiltersProps {
  filters: QuestionQueryParams;
  onFilterChange: (updated: Partial<QuestionQueryParams>) => void;
  subjects?: SubjectItem[];
}

export default function QuestionFilters({ filters, onFilterChange, subjects = [] }: QuestionFiltersProps) {
  const [tags, setTags] = useState<TagRecord[]>([]);
  const [showTagTopicModal, setShowTagTopicModal] = useState(false);
  const selectedSubject = subjects.find((s) => s.id === filters.subjectId);
  const chapters = selectedSubject?.chapters || [];
  const selectedChapter = chapters.find((chap) => chap.id === filters.chapterId);
  const activeTagIds: number[] = filters.tagIds?.length ? filters.tagIds : filters.tagId ? [filters.tagId] : [];
  const activeTopicIds: number[] = filters.topicIds?.length ? filters.topicIds : filters.topicId ? [filters.topicId] : [];

  useEffect(() => {
    async function loadTags() {
      try {
        const res = await fetch('/api/tags');
        const data = await res.json();
        if (data.success && data.data) {
          setTags(data.data);
        }
      } catch (err) {
        console.error('Failed to load tags for filters:', err);
      }
    }
    loadTags();
  }, []);

  return (
    <div
      className="card"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.875rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* Search Bar Component */}
      <div style={{ gridColumn: '1 / -1' }}>
        <SearchBar
          value={filters.search || ''}
          placeholder="Search question text, topics, explanation, or keywords..."
          onChange={(val) => onFilterChange({ search: val, page: 1, cursor: undefined })}
          onClear={() => onFilterChange({ search: '', page: 1, cursor: undefined })}
        />
      </div>

      {/* Tag/Topic Modal Trigger */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: '0.7rem 1rem', fontSize: '0.85rem' }}
            onClick={() => setShowTagTopicModal(true)}
          >
            Tag / Topic Filters
          </button>
          {(activeTagIds.length > 0 || activeTopicIds.length > 0) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              {activeTagIds.map((tagId: number) => {
                const tag = tags.find((t) => t.id === tagId);
                return tag ? (
                  <span
                    key={`tag-${tagId}`}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      background: '#22c55e30',
                      color: '#166534',
                      border: '1px solid #4d7c0f',
                    }}
                  >
                    #{tag.name}
                  </span>
                ) : null;
              })}
              {activeTopicIds.map((topicId) => {
                const topic = selectedChapter?.topics?.find((top) => top.id === topicId);
                return topic ? (
                  <span
                    key={`topic-${topicId}`}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      background: '#22c55e30',
                      color: '#166534',
                      border: '1px solid #4d7c0f',
                    }}
                  >
                    {topic.name}
                  </span>
                ) : null;
              })}
            </div>
          )}
      </div>

      {/* Subject Filter */}
      <div>
        <label className="form-label">Subject (বিষয়)</label>
        <select
          className="form-input"
          value={filters.subjectId || ''}
          onChange={(e) =>
            onFilterChange({
              subjectId: e.target.value ? Number(e.target.value) : undefined,
              chapterId: undefined,
              topicId: undefined,
              page: 1,
            })
          }
        >
          <option value="">All Subjects</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chapter Filter */}
      <div>
        <label className="form-label">Chapter (অধ্যায়)</label>
        <select
          className="form-input"
          value={filters.chapterId || ''}
          disabled={!filters.subjectId}
          onChange={(e) => onFilterChange({ chapterId: e.target.value ? Number(e.target.value) : undefined, topicId: undefined, page: 1 })}
        >
          <option value="">All Chapters</option>
          {chapters.map((chap) => (
            <option key={chap.id} value={chap.id}>
              {chap.name}
            </option>
          ))}
        </select>
      </div>

      {/* Topic Filter */}
      {/* Difficulty Filter */}
      <div>
        <label className="form-label">Difficulty Level</label>
        <select
          className="form-input"
          value={filters.difficulty || ''}
          onChange={(e) => onFilterChange({ difficulty: (e.target.value as any) || undefined, page: 1 })}
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy (সহজ)</option>
          <option value="medium">Medium (মধ্যম)</option>
          <option value="hard">Hard (কঠিন)</option>
        </select>
      </div>

      {/* Tag Filter */}
      {/* Status Filter */}
      <div>
        <label className="form-label">Status</label>
        <select
          className="form-input"
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ status: (e.target.value as any) || undefined, page: 1 })}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Clear Filters button */}
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ width: '100%', padding: '0.45rem', fontSize: '0.85rem' }}
          onClick={() => onFilterChange({
            search: '',
            questionType: undefined,
            subjectId: undefined,
            chapterId: undefined,
            topicId: undefined,
            topicIds: undefined,
            difficulty: undefined,
            tagId: undefined,
            tagIds: undefined,
            status: undefined,
            page: 1,
            cursor: undefined,
          })}
        >
          Reset Filters
        </button>
      </div>

      {showTagTopicModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '1rem',
          }}
          onClick={() => setShowTagTopicModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '760px',
              maxHeight: '90vh',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              overflow: 'auto',
              boxShadow: '0 30px 45px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Tag and Topic Filters</h2>
                <p style={{ margin: '0.5rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                  Select multiple tags or topics. Selected items will turn green and apply to the public question list.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTagTopicModal(false)}
                style={{ border: 'none', background: 'transparent', fontSize: '1.4rem', lineHeight: 1, cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                ×
              </button>
            </div>

            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', fontWeight: 700 }}>Tags</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
                {tags.length === 0 ? (
                  <div style={{ color: 'var(--color-text-muted)' }}>Loading tags…</div>
                ) : (
                  tags.map((tag) => {
                    const selected = activeTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          const nextTagIds = selected
                            ? activeTagIds.filter((id) => id !== tag.id)
                            : [...activeTagIds, tag.id];
                                  onFilterChange({ tagIds: nextTagIds.length ? nextTagIds : undefined, tagId: undefined, page: 1, cursor: undefined });
                        }}
                        style={{
                          padding: '0.75rem 0.85rem',
                          borderRadius: '9999px',
                          border: selected ? '1px solid #16a34a' : '1px solid #d1d5db',
                          background: selected ? '#dcfce7' : '#f9fafb',
                          color: selected ? '#166534' : '#111827',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: selected ? 700 : 500,
                        }}
                      >
                        #{tag.name}
                      </button>
                    );
                  })
                )}
              </div>
            </section>

            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', fontWeight: 700 }}>Topics</h3>
              {filters.chapterId && selectedChapter ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
                  {selectedChapter.topics?.map((topic) => {
                    const selected = activeTopicIds.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => {
                          const nextTopicIds = selected
                            ? activeTopicIds.filter((id) => id !== topic.id)
                            : [...activeTopicIds, topic.id];
                          onFilterChange({ topicIds: nextTopicIds.length ? nextTopicIds : undefined, topicId: undefined, page: 1, cursor: undefined });
                        }}
                        style={{
                          padding: '0.75rem 0.85rem',
                          borderRadius: '9999px',
                          border: selected ? '1px solid #16a34a' : '1px solid #d1d5db',
                          background: selected ? '#dcfce7' : '#f9fafb',
                          color: selected ? '#166534' : '#111827',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: selected ? 700 : 500,
                        }}
                      >
                        {topic.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div style={{ color: 'var(--color-text-muted)' }}>
                  Select a subject and chapter first to see topic options here.
                </div>
              )}
            </section>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  onFilterChange({ tagIds: undefined, tagId: undefined, topicIds: undefined, topicId: undefined, page: 1, cursor: undefined });
                }}
                style={{ flex: '1 1 auto', minWidth: '160px' }}
              >
                Clear Tag/Topic Filters
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowTagTopicModal(false)}
                style={{ flex: '1 1 auto', minWidth: '160px' }}
              >
                Apply and Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
