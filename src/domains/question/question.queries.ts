import { db } from '@/lib/db/client';
import { questions } from '@/lib/db/schema';
import { eq, and, like, desc, lt, sql } from 'drizzle-orm';
import { FullQuestion, getAllMockQuestions } from './question.repository';

export interface QuestionQueryParams {
  segmentId?: number;
  subjectId?: number;
  chapterId?: number;
  topicId?: number;
  admissionSegmentId?: number;
  admissionExamId?: number;
  admissionUnitId?: number;
  questionType?: 'mcq' | 'cq' | 'written';
  difficulty?: 'easy' | 'medium' | 'hard';
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
  year?: number;
  tagId?: number;
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

  try {
    const conditions = [];

    if (params.segmentId) conditions.push(eq(questions.segmentId, params.segmentId));
    if (params.subjectId) conditions.push(eq(questions.subjectId, params.subjectId));
    if (params.chapterId) conditions.push(eq(questions.chapterId, params.chapterId));
    if (params.topicId) conditions.push(eq(questions.topicId, params.topicId));
    if (params.admissionSegmentId) conditions.push(eq(questions.admissionSegmentId, params.admissionSegmentId));
    if (params.admissionExamId) conditions.push(eq(questions.admissionExamId, params.admissionExamId));
    if (params.admissionUnitId) conditions.push(eq(questions.admissionUnitId, params.admissionUnitId));
    if (params.questionType) conditions.push(eq(questions.questionType, params.questionType));
    if (params.difficulty) conditions.push(eq(questions.difficulty, params.difficulty));
    if (params.status) conditions.push(eq(questions.status, params.status));
    if (params.year) conditions.push(eq(questions.year, params.year));
    if (params.search) conditions.push(like(questions.questionText, `%${params.search}%`));

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
  } catch (err) {
    if (process.env.DATABASE_URL) {
      throw err;
    }
  }

  // Fallback to in-memory store
  let mock = getAllMockQuestions();

  if (params.segmentId) mock = mock.filter((q) => q.segmentId === params.segmentId);
  if (params.subjectId) mock = mock.filter((q) => q.subjectId === params.subjectId);
  if (params.chapterId) mock = mock.filter((q) => q.chapterId === params.chapterId);
  if (params.topicId) mock = mock.filter((q) => q.topicId === params.topicId);
  if (params.questionType) mock = mock.filter((q) => q.questionType === params.questionType);
  if (params.difficulty) mock = mock.filter((q) => q.difficulty === params.difficulty);
  if (params.status) mock = mock.filter((q) => q.status === params.status);
  if (params.year) mock = mock.filter((q) => q.year === params.year);
  if (params.tagId) mock = mock.filter((q) => q.tagIds?.includes(params.tagId!));
  if (params.search) {
    const s = params.search.toLowerCase();
    mock = mock.filter((q) => q.questionText.toLowerCase().includes(s) || (q.stimulusText && q.stimulusText.toLowerCase().includes(s)));
  }

  mock.sort((a, b) => b.id - a.id);

  if (cursorNum && !isNaN(cursorNum)) {
    mock = mock.filter((q) => q.id < cursorNum);
  }

  const total = mock.length;
  let paginated: FullQuestion[];
  let hasMore = false;
  let nextCursor: number | null = null;

  if (cursorNum) {
    const items = mock.slice(0, limit + 1);
    hasMore = items.length > limit;
    paginated = hasMore ? items.slice(0, limit) : items;
    nextCursor = hasMore ? paginated[paginated.length - 1].id : null;
  } else {
    paginated = mock.slice((page - 1) * limit, page * limit);
    hasMore = page * limit < total;
    nextCursor = paginated.length > 0 ? paginated[paginated.length - 1].id : null;
  }

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    nextCursor,
    hasMore,
  };
}

