import { db } from '@/lib/db/client';
import { bookmarks } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getQuestions } from '@/domains/question/question.service';
import { FullQuestion } from '@/domains/question/question.repository';

interface MockBookmark {
  id: number;
  userId: number;
  questionId: number;
  createdAt: string;
}

function getGlobalBookmarksStore(): MockBookmark[] {
  if (!(globalThis as any)._mockBookmarksStore) {
    (globalThis as any)._mockBookmarksStore = [];
  }
  return (globalThis as any)._mockBookmarksStore;
}

export async function getUserBookmarkedIds(userId: number): Promise<number[]> {
  try {
    const dbRows = await db.select().from(bookmarks).where(eq(bookmarks.userId, userId));
    if (dbRows && dbRows.length > 0) {
      return dbRows.map((r: any) => Number(r.questionId));
    }
  } catch (err) {
    console.error('Error fetching bookmarks from DB:', err);
  }

  const store = getGlobalBookmarksStore();
  return store.filter((b) => b.userId === userId).map((b) => b.questionId);
}

export async function getUserBookmarkedQuestions(userId: number): Promise<FullQuestion[]> {
  const bookmarkedIds = await getUserBookmarkedIds(userId);
  if (bookmarkedIds.length === 0) return [];

  const { questions: allQuestions } = await getQuestions({ limit: 100 });
  return allQuestions.filter((q) => bookmarkedIds.includes(q.id));
}

export async function toggleBookmark(userId: number, questionId: number): Promise<{ isBookmarked: boolean }> {
  const currentIds = await getUserBookmarkedIds(userId);
  const exists = currentIds.includes(questionId);

  if (exists) {
    // Remove
    try {
      await db
        .delete(bookmarks)
        .where(and(eq(bookmarks.userId, userId), eq(bookmarks.questionId, questionId)));
    } catch {}

    const store = getGlobalBookmarksStore();
    const idx = store.findIndex((b) => b.userId === userId && b.questionId === questionId);
    if (idx !== -1) {
      store.splice(idx, 1);
    }
    return { isBookmarked: false };
  } else {
    // Add
    try {
      await db.insert(bookmarks).values({
        userId,
        questionId,
      });
    } catch {}

    const store = getGlobalBookmarksStore();
    store.push({
      id: Date.now(),
      userId,
      questionId,
      createdAt: new Date().toISOString(),
    });
    return { isBookmarked: true };
  }
}
