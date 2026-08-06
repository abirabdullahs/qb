import { db } from '@/lib/db/client';
import { questions, questionTags } from '@/lib/db/schema';
import { eq, and, ilike, or, desc, lt, sql, inArray } from 'drizzle-orm';
import { FullQuestion } from './question.repository';

export interface QuestionQueryParams {
  segmentId?: number;
  subjectId?: number;
  chapterId?: number;
  topicId?: number;
  topicIds?: number[];
  tagId?: number;
  tagIds?: number[];
  admissionSegmentId?: number;
  admissionExamId?: number;
  admissionUnitId?: number;
  questionType?: 'mcq' | 'cq' | 'written';
  difficulty?: 'easy' | 'medium' | 'hard';
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
  year?: number;
  search?: string;
  cursor?: number | string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page?: number;
  limit: number;
  totalPages?: number;
  nextCursor?: number | null;
  hasMore?: boolean;
}

export async function queryQuestions(params: QuestionQueryParams): Promise<PaginatedResult<FullQuestion>> {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const cursorNum = params.cursor ? Number(params.cursor) : null;
  const topicFilterIds = params.topicIds?.length ? params.topicIds : params.topicId ? [params.topicId] : undefined;
  const tagFilterIds = params.tagIds?.length ? params.tagIds : params.tagId ? [params.tagId] : undefined;

  const conditions = [];

  if (params.segmentId) conditions.push(eq(questions.segmentId, params.segmentId));
  if (params.subjectId) conditions.push(eq(questions.subjectId, params.subjectId));
  if (params.chapterId) conditions.push(eq(questions.chapterId, params.chapterId));
  if (topicFilterIds) conditions.push(inArray(questions.topicId, topicFilterIds));
  if (params.admissionSegmentId) conditions.push(eq(questions.admissionSegmentId, params.admissionSegmentId));
  if (params.admissionExamId) conditions.push(eq(questions.admissionExamId, params.admissionExamId));
  if (params.admissionUnitId) conditions.push(eq(questions.admissionUnitId, params.admissionUnitId));
  if (params.questionType) conditions.push(eq(questions.questionType, params.questionType));
  if (params.difficulty) conditions.push(eq(questions.difficulty, params.difficulty));
  if (params.status) conditions.push(eq(questions.status, params.status));
  if (params.year) conditions.push(eq(questions.year, params.year));
  if (params.search) {
    const term = `%${params.search}%`;
    conditions.push(
      or(
        ilike(questions.questionText, term),
        ilike(questions.explanationText, term),
        ilike(questions.stimulusText, term),
        ilike(questions.examName, term)
      )
    );
  }

  if (tagFilterIds && tagFilterIds.length > 0) {
    const rows = await db
      .select({ questionId: questionTags.questionId })
      .from(questionTags)
      .where(inArray(questionTags.tagId, tagFilterIds))
      .groupBy(questionTags.questionId);
    const questionIds = rows.map((row: { questionId: number }) => row.questionId);
    if (questionIds.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
        nextCursor: null,
        hasMore: false,
      };
    }
    conditions.push(inArray(questions.id, questionIds));
  }

  if (cursorNum && !isNaN(cursorNum)) {
    conditions.push(lt(questions.id, cursorNum));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  if (process.env.DATABASE_URL) {
    try {
      const queryBuilder = db
        .select()
        .from(questions)
        .where(whereClause)
        .orderBy(desc(questions.id))
        .limit(limit + 1);

      if (!cursorNum) {
        queryBuilder.offset((page - 1) * limit);
      }

      const dbQuestions = await queryBuilder;
      const hasMore = dbQuestions.length > limit;
      const data = hasMore ? dbQuestions.slice(0, limit) : dbQuestions;
      const nextCursor = hasMore ? (data[data.length - 1] as any).id : null;

      const countRes = await db.select({ count: sql<number>`count(*)` }).from(questions).where(whereClause);
      const total = Number(countRes[0]?.count || data.length);

      return {
        data: data as unknown as FullQuestion[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        nextCursor,
        hasMore,
      };
    } catch (err) {
      console.error('[queryQuestions] Database query failed:', err);
      throw new Error('Database query failed. Please check connection and logs.');
    }
  }

  throw new Error('Database URL is not configured. Question queries require a connected database.');
}

