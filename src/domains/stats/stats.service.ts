import { db } from '@/lib/db/client';
import { questionStats, questions, questionSets } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export interface DashboardOverviewStats {
  totalQuestions: number;
  pendingQuestions: number;
  approvedQuestions: number;
  rejectedQuestions: number;
  totalSets: number;
  totalAttempts: number;
  accuracyRate: number;
}

export async function getDashboardStats(): Promise<DashboardOverviewStats> {
  let totalQuestions = 0;
  let pendingQuestions = 0;
  let approvedQuestions = 0;
  let rejectedQuestions = 0;
  let totalSets = 0;
  let totalAttempts = 0;
  let totalCorrect = 0;

  try {
    if (process.env.DATABASE_URL) {
      const allQ = await db.select({ status: questions.status }).from(questions);
      totalQuestions = allQ.length;
      pendingQuestions = allQ.filter((q: any) => q.status === 'pending').length;
      approvedQuestions = allQ.filter((q: any) => q.status === 'approved').length;
      rejectedQuestions = allQ.filter((q: any) => q.status === 'rejected').length;

      const sets = await db.select({ id: questionSets.id }).from(questionSets);
      totalSets = sets.length;

      const statsRows = await db.select().from(questionStats);
      totalAttempts = statsRows.reduce((acc: number, curr: any) => acc + Number(curr.attemptCount || 0), 0);
      totalCorrect = statsRows.reduce((acc: number, curr: any) => acc + Number(curr.correctCount || 0), 0);
    }
  } catch (err) {
    console.warn('Failed to fetch stats from DB, falling back to basic metrics:', err);
  }

  const accuracyRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return {
    totalQuestions,
    pendingQuestions,
    approvedQuestions,
    rejectedQuestions,
    totalSets,
    totalAttempts,
    accuracyRate,
  };
}

export async function recordQuestionAttempt(questionId: number, isCorrect: boolean, timeSeconds?: number) {
  try {
    if (process.env.DATABASE_URL) {
      const existing = await db
        .select()
        .from(questionStats)
        .where(eq(questionStats.questionId, questionId));

      if (existing.length > 0) {
        await db
          .update(questionStats)
          .set({
            attemptCount: sql`${questionStats.attemptCount} + 1`,
            correctCount: isCorrect ? sql`${questionStats.correctCount} + 1` : questionStats.correctCount,
            updatedAt: new Date(),
          })
          .where(eq(questionStats.questionId, questionId));
      } else {
        await db.insert(questionStats).values({
          questionId,
          attemptCount: 1,
          correctCount: isCorrect ? 1 : 0,
          avgTimeSeconds: timeSeconds ? String(timeSeconds) : null,
        });
      }
    }
  } catch (err) {
    console.warn('Failed to record question attempt:', err);
  }
}
