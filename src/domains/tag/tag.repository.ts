import { db } from '@/lib/db/client';
import { tags, questionTags } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';

export interface TagRecord {
  id: number;
  name: string;
}

let mockTagsStore: TagRecord[] = [
  { id: 1, name: 'HSC-2025' },
  { id: 2, name: 'BUET-Admission' },
  { id: 3, name: 'Medical-GK' },
  { id: 4, name: 'Important-Formula' },
  { id: 5, name: 'Board-Top' },
];

let mockQuestionTagsStore: { questionId: number; tagId: number }[] = [];

export async function findAllTags(): Promise<TagRecord[]> {
  try {
    if (process.env.DATABASE_URL) {
      return await db.select().from(tags);
    }
  } catch (err) {
    console.warn('DB findAllTags failed, using mock tags store:', err);
  }
  return mockTagsStore;
}

export async function findOrCreateTag(name: string): Promise<TagRecord> {
  const normalized = name.trim();
  try {
    if (process.env.DATABASE_URL) {
      const existing = await db.select().from(tags).where(eq(tags.name, normalized));
      if (existing.length > 0) return existing[0];

      const [inserted] = await db.insert(tags).values({ name: normalized }).returning();
      return inserted;
    }
  } catch (err) {
    console.warn('DB findOrCreateTag failed:', err);
  }

  const existingMock = mockTagsStore.find((t) => t.name.toLowerCase() === normalized.toLowerCase());
  if (existingMock) return existingMock;

  const newTag: TagRecord = {
    id: mockTagsStore.length + 1,
    name: normalized,
  };
  mockTagsStore.push(newTag);
  return newTag;
}

export async function attachTagsToQuestion(questionId: number, tagIds: number[]): Promise<boolean> {
  if (tagIds.length === 0) return true;
  try {
    if (process.env.DATABASE_URL) {
      // Remove existing question_tags then insert
      await db.delete(questionTags).where(eq(questionTags.questionId, questionId));
      await db.insert(questionTags).values(
        tagIds.map((tagId) => ({ questionId, tagId }))
      );
      return true;
    }
  } catch (err) {
    console.warn('DB attachTagsToQuestion failed:', err);
  }

  mockQuestionTagsStore = mockQuestionTagsStore.filter((qt) => qt.questionId !== questionId);
  tagIds.forEach((tagId) => mockQuestionTagsStore.push({ questionId, tagId }));
  return true;
}

export async function getTagsForQuestion(questionId: number): Promise<TagRecord[]> {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await db
        .select({ id: tags.id, name: tags.name })
        .from(questionTags)
        .innerJoin(tags, eq(questionTags.tagId, tags.id))
        .where(eq(questionTags.questionId, questionId));
      return rows;
    }
  } catch (err) {
    console.warn('DB getTagsForQuestion failed:', err);
  }

  const tagIds = mockQuestionTagsStore.filter((qt) => qt.questionId === questionId).map((qt) => qt.tagId);
  return mockTagsStore.filter((t) => tagIds.includes(t.id));
}
