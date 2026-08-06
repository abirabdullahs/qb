import { db } from '@/lib/db/client';
import { questions } from '@/lib/db/schema';
import { eq, and, like, desc, sql } from 'drizzle-orm';
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
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function queryQuestions(params: QuestionQueryParams): Promise<PaginatedResult<FullQuestion>> {
  const page = params.page || 1;
  const limit = params.limit || 10;

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

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const dbQuestions = await db
      .select()
      .from(questions)
      .where(whereClause)
      .orderBy(desc(questions.id))
      .limit(limit)
      .offset((page - 1) * limit);

    if (dbQuestions && dbQuestions.length > 0) {
      const countRes = await db.select({ count: sql<number>`count(*)` }).from(questions).where(whereClause);
      const total = Number(countRes[0]?.count || dbQuestions.length);

      return {
        data: dbQuestions as unknown as FullQuestion[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }
  } catch {}

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

  const total = mock.length;
  const paginated = mock.slice((page - 1) * limit, page * limit);

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
