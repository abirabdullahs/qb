import { db } from '@/lib/db/client';
import { questionSets, questionSetItems, questions } from '@/lib/db/schema';
import { eq, inArray, desc } from 'drizzle-orm';
import { FullQuestion, findQuestionById } from '../question/question.repository';

export interface QuestionSetRecord {
  id: number;
  name: string;
  segmentId?: number | null;
  negativeMarking?: number | string | null;
  createdBy?: number | null;
  createdAt?: Date | string;
  items?: {
    questionId: number;
    orderNo: number;
    marksOverride?: number | null;
    question?: FullQuestion;
  }[];
}

let mockQuestionSetsStore: QuestionSetRecord[] = [
  {
    id: 1,
    name: 'HSC Physics Chapter 1 Model Test (এইচএসসি পদার্থ বিজ্ঞান)',
    segmentId: 1,
    negativeMarking: '0.25',
    createdAt: new Date().toISOString(),
    items: [
      { questionId: 1, orderNo: 1, marksOverride: 1 },
      { questionId: 2, orderNo: 2, marksOverride: 1 },
      { questionId: 3, orderNo: 3, marksOverride: 1 },
    ],
  },
  {
    id: 2,
    name: 'BUET Admission Practice Set 2025 (বুয়েট মডেল টেস্ট)',
    segmentId: 2,
    negativeMarking: '0.50',
    createdAt: new Date().toISOString(),
    items: [
      { questionId: 1, orderNo: 1, marksOverride: 10 },
      { questionId: 3, orderNo: 2, marksOverride: 10 },
    ],
  },
];

export async function findAllQuestionSets(): Promise<QuestionSetRecord[]> {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await db.select().from(questionSets).orderBy(desc(questionSets.createdAt));
      return rows.map((r: any) => ({ ...r, negativeMarking: Number(r.negativeMarking) || 0 }));
    }
  } catch (err) {
    console.warn('DB findAllQuestionSets failed, using mock store:', err);
  }
  return mockQuestionSetsStore;
}

export async function findQuestionSetById(id: number): Promise<QuestionSetRecord | null> {
  try {
    if (process.env.DATABASE_URL) {
      const setRows = await db.select().from(questionSets).where(eq(questionSets.id, id));
      if (setRows.length === 0) return null;
      const setObj = setRows[0];

      const itemRows = await db
        .select()
        .from(questionSetItems)
        .where(eq(questionSetItems.setId, id))
        .orderBy(questionSetItems.orderNo);

      const items = await Promise.all(
        itemRows.map(async (item: any) => {
          const q = await findQuestionById(item.questionId);
          return {
            questionId: item.questionId,
            orderNo: item.orderNo || 0,
            marksOverride: item.marksOverride ? Number(item.marksOverride) : null,
            question: q || undefined,
          };
        })
      );

      return {
        ...setObj,
        negativeMarking: Number(setObj.negativeMarking) || 0,
        items,
      };
    }
  } catch (err) {
    console.warn('DB findQuestionSetById failed, using mock store:', err);
  }

  const found = mockQuestionSetsStore.find((s) => s.id === id);
  if (!found) return null;

  const populatedItems = await Promise.all(
    (found.items || []).map(async (it) => {
      const q = await findQuestionById(it.questionId);
      return {
        ...it,
        question: q || undefined,
      };
    })
  );

  return { ...found, items: populatedItems };
}

export async function insertQuestionSet(
  name: string,
  negativeMarking: number,
  questionIds: number[]
): Promise<QuestionSetRecord> {
  try {
    if (process.env.DATABASE_URL) {
      const [insertedSet] = await db
        .insert(questionSets)
        .values({
          name,
          negativeMarking: String(negativeMarking),
        })
        .returning();

      if (questionIds.length > 0) {
        await db.insert(questionSetItems).values(
          questionIds.map((qId, idx) => ({
            setId: insertedSet.id,
            questionId: qId,
            orderNo: idx + 1,
          }))
        );
      }

      return {
        ...insertedSet,
        negativeMarking,
        items: questionIds.map((qId, idx) => ({ questionId: qId, orderNo: idx + 1 })),
      };
    }
  } catch (err) {
    console.warn('DB insertQuestionSet failed:', err);
  }

  const newSet: QuestionSetRecord = {
    id: mockQuestionSetsStore.length + 1,
    name,
    negativeMarking,
    createdAt: new Date().toISOString(),
    items: questionIds.map((qId, idx) => ({ questionId: qId, orderNo: idx + 1 })),
  };

  mockQuestionSetsStore.unshift(newSet);
  return newSet;
}

export async function deleteQuestionSetRecord(id: number): Promise<boolean> {
  try {
    if (process.env.DATABASE_URL) {
      await db.delete(questionSets).where(eq(questionSets.id, id));
      return true;
    }
  } catch (err) {
    console.warn('DB deleteQuestionSetRecord failed:', err);
  }

  mockQuestionSetsStore = mockQuestionSetsStore.filter((s) => s.id !== id);
  return true;
}
