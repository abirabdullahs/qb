'use client';

import React, { useEffect, useState } from 'react';
import type { FullQuestion } from '@/domains/question/question.repository';
import QuestionCard from '@/domains/question/QuestionCard';
import { Bookmark, Loader2, BookOpen, Search } from 'lucide-react';
import Link from 'next/link';

export default function BookmarksPage() {
  const [questions, setQuestions] = useState<FullQuestion[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bookmarks');
      const data = await res.json();

      if (res.status === 401) {
        setError('Please log in or register to view your bookmarked questions.');
        setLoading(false);
        return;
      }

      if (data.success) {
        setQuestions(data.data.questions || []);
        setBookmarkedIds(data.data.bookmarkedIds || []);
      } else {
        setError(data.error || 'Failed to load bookmarks');
      }
    } catch {
      setError('An error occurred while fetching your bookmarks.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = (questionId: number, isBookmarked: boolean) => {
    if (!isBookmarked) {
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      setBookmarkedIds((prev) => prev.filter((id) => id !== questionId));
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const qAny = q as any;
    return (
      q.questionText.toLowerCase().includes(term) ||
      (q.examName && q.examName.toLowerCase().includes(term)) ||
      (qAny.subjectName && qAny.subjectName.toLowerCase().includes(term)) ||
      (qAny.chapterName && qAny.chapterName.toLowerCase().includes(term)) ||
      (qAny.topicName && qAny.topicName.toLowerCase().includes(term))
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bookmark style={{ color: '#D97706' }} />
            <span>My Bookmarked Questions</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Review and practice all your saved questions in one place.
          </p>
        </div>

        <Link href="/questions" className="btn btn-secondary">
          <BookOpen size={18} />
          <span>Browse All Questions</span>
        </Link>
      </div>

      {error ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
            {error}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Bookmarking is available for registered students and contributors.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link href="/login" className="btn btn-secondary">Sign In</Link>
            <Link href="/register" className="btn btn-primary">Create Account</Link>
          </div>
        </div>
      ) : loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }}>
          <Loader2 className="animate-spin" size={28} style={{ color: 'var(--color-primary)' }} />
        </div>
      ) : questions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Bookmark size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
            No Bookmarked Questions Yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
            While browsing the question bank, click the <strong>Bookmark</strong> button on any question to save it here for fast revision before exams.
          </p>
          <Link href="/questions" className="btn btn-primary">
            Explore Question Bank
          </Link>
        </div>
      ) : (
        <div>
          {/* Search Filter Bar */}
          <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Search inside bookmarked questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', fontWeight: 600 }}>
              Saved: {questions.length}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                initialBookmarked={true}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
