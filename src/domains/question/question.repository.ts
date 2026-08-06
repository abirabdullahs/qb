import { db } from '@/lib/db/client';
import { questions, questionOptions, questionSubParts, questionBoards } from '@/lib/db/schema';
import { eq, and, sql, desc } from 'drizzle-orm';

export interface FullQuestion {
  id: number;
  branchType?: 'academic' | 'admission';
  segmentId?: number | null;
  groupId?: number | null;
  admissionSegmentId?: number | null;
  admissionExamId?: number | null;
  admissionUnitId?: number | null;
  instituteId?: number | null;
  subjectId: number;
  chapterId?: number | null;
  topicId?: number | null;
  subTopicId?: number | null;
  questionType: 'mcq' | 'cq' | 'written';
  stimulusText?: string | null;
  questionText: string;
  hasMath: boolean;
  cqStyle?: string | null;
  year?: number | null;
  examName?: string | null;
  isPreviousYear?: boolean;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  answerText?: string | null;
  explanationText?: string | null;
  videoSolutionUrl?: string | null;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  contributorId?: number | null;
  reviewedBy?: number | null;
  duplicateHash?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  options?: any[];
  subParts?: any[];
  boardIds?: number[];
  tagIds?: number[];
  attachments?: any[];
}

export async function findQuestionById(id: number): Promise<FullQuestion | null> {
  // FIX: previously wrapped in try/catch{} that silently fell back to two
  // hardcoded sample questions on any DB error — meaning a real DB outage
  // looked identical to "question not found," and real questions could be
  // masked by fake sample data. Errors now propagate to the caller (the
  // API route), which returns a proper 500 instead of wrong/fake data.
  const res = await db.select().from(questions).where(eq(questions.id, id));
  if (!res || res.length === 0) return null;

  const q = res[0] as unknown as FullQuestion;
  const [opts, subs, boardsList] = await Promise.all([
    db.select().from(questionOptions).where(eq(questionOptions.questionId, id)),
    db.select().from(questionSubParts).where(eq(questionSubParts.questionId, id)),
    db.select().from(questionBoards).where(eq(questionBoards.questionId, id)),
  ]);

  return {
    ...q,
    options: opts,
    subParts: subs,
    boardIds: boardsList.map((b: any) => b.boardId),
  };
}

export async function findQuestionByHash(hash: string): Promise<FullQuestion | null> {
  const res = await db.select().from(questions).where(eq(questions.duplicateHash, hash));
  return (res && res.length > 0) ? (res[0] as unknown as FullQuestion) : null;
}

export async function insertQuestionRecord(data: FullQuestion): Promise<FullQuestion> {
  // FIX: previously this function would silently guess a segmentId (1 or 2
  // based on branchType), grab an arbitrary existing segment from the DB,
  // or even INSERT a brand-new segment row with an invalid segmentKind
  // ('curriculum' isn't a valid value — the schema expects 'academic' or
  // 'admission') if none was provided. That corrupted data and hid a
  // missing required field. segmentId must now be a real, valid value
  // supplied by the caller (the form/service layer) — no guessing.
  // The `segments` table always has at least an academic and an admission
  // segment row (see FIX below for admission handling) — but the
  // `questions.segment_id` column itself is NOT NULL in the schema, so
  // TypeScript (correctly) refuses a `number | null` value here. We
  // resolve a concrete number before building the insert payload instead
  // of passing a nullable value through to Drizzle.
  if (data.branchType === 'academic' && !data.segmentId) {
    throw new Error(
      'segmentId is required for academic-branch questions (e.g. SSC, HSC, Dakhil, Alim). ' +
      'Select a segment in the question form before submitting.'
    );
  }
  if (data.branchType === 'admission' && !data.segmentId) {
    throw new Error(
      'segmentId is required even for admission-branch questions — pass the ' +
      "id of the 'Admission' segment row. Look it up via /api/academic/segments " +
      "and cache it, rather than leaving this to the database layer to guess."
    );
  }
  // Final unconditional narrowing check (in addition to the two branch-
  // specific messages above) so TypeScript can guarantee a plain `number`
  // reaches db.insert() below — the questions.segment_id column is
  // NOT NULL, so `number | null | undefined` is never a valid insert value.
  if (data.segmentId == null) {
    throw new Error('segmentId is required for all questions.');
  }
  const resolvedSegmentId: number = data.segmentId;

  // FIX: the HTTP-based Neon driver used by Vercel serverless functions
  // does not support Drizzle transactions. The create flow therefore uses
  // sequential inserts with rollback on failure so a partial insert does not
  // leave a broken question row behind.
  let createdQuestionId: number | undefined;

  try {
    const inserted = await db
      .insert(questions)
      .values({
        segmentId: resolvedSegmentId,
        groupId: data.groupId || null,
        admissionSegmentId: data.admissionSegmentId || null,
        admissionExamId: data.admissionExamId || null,
        admissionUnitId: data.admissionUnitId || null,
        instituteId: data.instituteId || null,
        subjectId: data.subjectId,
        chapterId: data.chapterId || null,
        topicId: data.topicId || null,
        subTopicId: data.subTopicId || null,
        questionType: data.questionType,
        stimulusText: data.stimulusText || null,
        questionText: data.questionText,
        hasMath: data.hasMath,
        cqStyle: data.cqStyle || null,
        year: data.year || null,
        examName: data.examName || null,
        isPreviousYear: data.isPreviousYear || false,
        marks: String(data.marks || 1),
        difficulty: data.difficulty || 'medium',
        language: data.language || 'bn',
        answerText: data.answerText || null,
        explanationText: data.explanationText || null,
        videoSolutionUrl: data.videoSolutionUrl || null,
        status: data.status || 'pending',
        contributorId: data.contributorId || null,
        duplicateHash: data.duplicateHash || null,
      })
      .returning();

    if (!inserted || !inserted[0]) {
      throw new Error('Failed to insert question record — no row returned.');
    }

    createdQuestionId = inserted[0].id;

    if (createdQuestionId == null) {
      throw new Error('Failed to resolve the created question id.');
    }

    const questionId = createdQuestionId as number;

    if (data.options && data.options.length > 0) {
      await db.insert(questionOptions).values(
        data.options.map((opt, idx) => ({
          questionId,
          optionLabel: opt.optionLabel,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
          explanationText: opt.explanationText || null,
          orderNo: idx + 1,
        }))
      );
    }

    if (data.subParts && data.subParts.length > 0) {
      await db.insert(questionSubParts).values(
        data.subParts.map((sp, idx) => ({
          questionId,
          partLabel: sp.partLabel,
          partText: sp.partText,
          marks: String(sp.marks || 1),
          cognitiveLevel: sp.cognitiveLevel || null,
          answerText: sp.answerText || null,
          explanationText: sp.explanationText || null,
          orderNo: idx + 1,
        }))
      );
    }

    if (data.boardIds && data.boardIds.length > 0) {
      await db.insert(questionBoards).values(
        data.boardIds.map((boardId) => ({ questionId, boardId }))
      );
    }

    return {
      ...data,
      id: questionId,
      createdAt: inserted[0].createdAt,
      updatedAt: inserted[0].updatedAt,
    };
  } catch (error) {
    if (createdQuestionId != null) {
      await db.delete(questions).where(eq(questions.id, createdQuestionId));
    }
    throw error;
  }
}

export async function updateQuestionRecord(id: number, updates: Partial<FullQuestion>): Promise<FullQuestion | null> {
  const existing = await findQuestionById(id);
  if (!existing) return null;

  // FIX: previously wrapped in try/catch{} — a failed UPDATE would be
  // silently ignored and the function would still return "updated" data
  // to the caller, even though nothing changed in the database. Errors
  // now propagate so the API route can report the real failure.
  await db
    .update(questions)
    .set({
      questionText: updates.questionText ?? existing.questionText,
      stimulusText: updates.stimulusText ?? existing.stimulusText,
      explanationText: updates.explanationText ?? existing.explanationText,
      answerText: updates.answerText ?? existing.answerText,
      difficulty: updates.difficulty ?? existing.difficulty,
      status: updates.status ?? existing.status,
      reviewedBy: updates.reviewedBy ?? existing.reviewedBy,
      updatedAt: new Date(),
    })
    .where(eq(questions.id, id));

  return { ...existing, ...updates, updatedAt: new Date().toISOString() };
}

export async function deleteQuestionRecord(id: number): Promise<boolean> {
  // FIX: same issue as update — a failed delete used to be swallowed and
  // reported as success. Now it propagates.
  const result = await db.delete(questions).where(eq(questions.id, id)).returning();
  return result.length > 0;
}