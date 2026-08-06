'use client';

import React, { useEffect, useState } from 'react';
import { QuestionQueryParams } from './question.queries';
import { SubjectItem } from '../academic/service';
import SearchBar from '../search/SearchBar';
import TagSelector from '../tag/TagSelector';
import { TagRecord } from '../tag/tag.repository';

interface QuestionFiltersProps {
  filters: QuestionQueryParams;
  onFilterChange: (updated: Partial<QuestionQueryParams>) => void;
  subjects?: SubjectItem[];
}

export default function QuestionFilters({ filters, onFilterChange, subjects = [] }: QuestionFiltersProps) {
  const [tags, setTags] = useState<TagRecord[]>([]);
  const selectedSubject = subjects.find((s) => s.id === filters.subjectId);
  const chapters = selectedSubject?.chapters || [];

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
          onChange={(val) => onFilterChange({ search: val, page: 1 })}
          onClear={() => onFilterChange({ search: '', page: 1 })}
        />
      </div>

      {/* Question Type */}
      <div>
        <label className="form-label">Question Type</label>
        <select
          className="form-input"
          value={filters.questionType || ''}
          onChange={(e) => onFilterChange({ questionType: (e.target.value as any) || undefined, page: 1 })}
        >
          <option value="">All Types (MCQ, CQ, Written)</option>
          <option value="mcq">MCQ (বহুনির্বাচনী)</option>
          <option value="cq">CQ (সৃজনশীল)</option>
          <option value="written">Written (রচনামূলক)</option>
        </select>
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
      <div>
        <label className="form-label">Topic</label>
        <select
          className="form-input"
          value={filters.topicId || ''}
          disabled={!filters.chapterId}
          onChange={(e) => onFilterChange({ topicId: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
        >
          <option value="">All Topics</option>
          {selectedSubject?.chapters
            ?.find((chap) => chap.id === filters.chapterId)
            ?.topics?.map((top) => (
              <option key={top.id} value={top.id}>
                {top.name}
              </option>
            ))}
        </select>
      </div>

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
      <div>
        <label className="form-label">Tag / Topic</label>
        <TagSelector
          selectedTagId={filters.tagId}
          tags={tags}
          onSelectTag={(tagId) => onFilterChange({ tagId: tagId || undefined, page: 1 })}
        />
      </div>

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
          onClick={() => onFilterChange({ search: '', questionType: undefined, subjectId: undefined, chapterId: undefined, topicId: undefined, difficulty: undefined, tagId: undefined, status: undefined, page: 1 })}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
