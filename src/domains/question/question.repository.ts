import { db } from '@/lib/db/client';
import { questions, questionOptions, questionSubParts, questionBoards, questionTags, segments } from '@/lib/db/schema';
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

// In-memory fallback data store for questions when DB is in dev/offline mode
let mockQuestionsStore: FullQuestion[] = [
  {
    id: 1,
    subjectId: 1,
    chapterId: 102,
    topicId: 1004,
    questionType: 'mcq',
    questionText: 'দুটি সমান ভেক্টরের লব্ধির মান তাদের যেকোনো একটির মানের সমান হলে ভেক্টরদ্বয়ের মধ্যবর্তী কোণ কত?',
    hasMath: true,
    difficulty: 'medium',
    language: 'bn',
    marks: 1,
    status: 'approved',
    explanationText: 'আমরা জানি, $R^2 = P^2 + Q^2 + 2PQ\\cos\\alpha$। শর্তমতে $P=Q=R$, সুতরাং $1 = 1 + 1 + 2\\cos\\alpha \\implies \\cos\\alpha = -1/2 \\implies \\alpha = 120^\\circ$।',
    options: [
      { id: 1, optionLabel: 'ক', optionText: '$60^\\circ$', isCorrect: false },
      { id: 2, optionLabel: 'খ', optionText: '$90^\\circ$', isCorrect: false },
      { id: 3, optionLabel: 'গ', optionText: '$120^\\circ$', isCorrect: true },
      { id: 4, optionLabel: 'ঘ', optionText: '$180^\\circ$', isCorrect: false },
    ],
    boardIds: [1],
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    subjectId: 2,
    chapterId: 202,
    topicId: 2002,
    questionType: 'cq',
    stimulusText: 'অ্যালুমিনিয়াম আয়নের ($Al^{3+}$) সর্ববহিঃস্থ স্তরের ইলেকট্রনসমূহের কোয়ান্টাম সংখ্যা পর্যবেক্ষণ করা হলো।',
    questionText: 'কোয়ান্টাম সংখ্যা বিষয়ক সৃজনশীল প্রশ্ন:',
    hasMath: true,
    difficulty: 'hard',
    language: 'bn',
    marks: 10,
    status: 'approved',
    subParts: [
      { id: 1, partLabel: 'ক', partText: 'আউফবাউ নীতিটি বিবৃত করো।', marks: 1, cognitiveLevel: 'knowledge', answerText: 'ইলেকট্রন প্রথমে সর্বনিম্ন শক্তির অরবিটালে প্রবেশ করে এবং পরে ক্রমান্বয়ে উচ্চ শক্তির অরবিটাল পূর্ণ করে।' },
      { id: 2, partLabel: 'খ', partText: '$3f$ অরবিটাল সম্ভব নয় কেন? ব্যাখ্যা করো।', marks: 2, cognitiveLevel: 'comprehension', answerText: '$n=3$ হলে $l$ এর মান $0, 1, 2$ হতে পারে। $f$ অরবিটালের জন্য $l=3$ প্রয়োজন, যা অসম্ভব।' },
      { id: 3, partLabel: 'গ', partText: 'উদ্দীপকের $Al^{3+}$ আয়নের শেষ ইলেকট্রনের চারটি কোয়ান্টাম সংখ্যার মান নির্ণয় করো।', marks: 3, cognitiveLevel: 'application' },
      { id: 4, partLabel: 'ঘ', partText: 'পাউলির বর্জন নীতি উদ্দীপকের ইলেকট্রন বিন্যাসের ক্ষেত্রে কীভাবে প্রযোজ্য হয় বিশ্লেষণ করো।', marks: 4, cognitiveLevel: 'higher_ability' },
    ],
    createdAt: new Date().toISOString(),
  },
];

export async function findQuestionById(id: number): Promise<FullQuestion | null> {
  try {
    const res = await db.select().from(questions).where(eq(questions.id, id));
    if (res && res.length > 0) {
      const q = res[0] as unknown as FullQuestion;
      const opts = await db.select().from(questionOptions).where(eq(questionOptions.questionId, id));
      const subs = await db.select().from(questionSubParts).where(eq(questionSubParts.questionId, id));
      const boardsList = await db.select().from(questionBoards).where(eq(questionBoards.questionId, id));
      return {
        ...q,
        options: opts,
        subParts: subs,
        boardIds: boardsList.map((b: any) => b.boardId),
      };
    }
  } catch {}

  const found = mockQuestionsStore.find((q) => q.id === id);
  return found || null;
}

export async function findQuestionByHash(hash: string): Promise<FullQuestion | null> {
  try {
    const res = await db.select().from(questions).where(eq(questions.duplicateHash, hash));
    if (res && res.length > 0) {
      return res[0] as unknown as FullQuestion;
    }
  } catch {}

  const found = mockQuestionsStore.find((q) => q.duplicateHash === hash);
  return found || null;
}

export async function insertQuestionRecord(data: FullQuestion): Promise<FullQuestion> {
  const newId = Date.now();
  const newQ: FullQuestion = {
    ...data,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    // If DB is configured but incoming data lacks segmentId, try to pick a sensible default.
    let segmentIdToUse = data.segmentId ?? null;
    if (!segmentIdToUse && process.env.DATABASE_URL) {
      try {
        const segs = await db.select().from(segments).limit(1);
        if (segs && segs.length > 0) segmentIdToUse = segs[0].id;
      } catch (err) {
        // ignore - let DB handle missing segment
      }
    }
    // If DB is configured and we still have no segment id, fail early with a clear message
    if (!segmentIdToUse && process.env.DATABASE_URL) {
      throw new Error('No segmentId provided and no segment rows found in DB. Create a segment or provide segmentId in the payload.');
    }

    const inserted = await db
      .insert(questions)
      .values({
        segmentId: segmentIdToUse || null,
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

    if (inserted && inserted[0]) {
      const qId = inserted[0].id;
      if (data.options && data.options.length > 0) {
        await db.insert(questionOptions).values(
          data.options.map((opt, idx) => ({
            questionId: qId,
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
            questionId: qId,
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
      return { ...newQ, id: qId };
    }
  } catch (err) {
    console.error('[insertQuestionRecord] Database insert failed:', err);
    // If no real database configured, fall back to mock store for local/dev convenience
    if (!process.env.DATABASE_URL) {
      mockQuestionsStore.unshift(newQ);
      return newQ;
    }
    // With a configured DATABASE_URL we should not silently succeed — propagate error
    throw err;
  }

  // Fallback: if DB did not throw but didn't return inserted row, handle gracefully
  if (!process.env.DATABASE_URL) {
    mockQuestionsStore.unshift(newQ);
    return newQ;
  }
  throw new Error('Failed to insert question record and no fallback available.');
}

export async function updateQuestionRecord(id: number, updates: Partial<FullQuestion>): Promise<FullQuestion | null> {
  const existing = await findQuestionById(id);
  if (!existing) return null;

  const updated: FullQuestion = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    await db
      .update(questions)
      .set({
        questionText: updates.questionText ?? existing.questionText,
        stimulusText: updates.stimulusText ?? existing.stimulusText,
        explanationText: updates.explanationText ?? existing.explanationText,
        answerText: updates.answerText ?? existing.answerText,
        difficulty: updates.difficulty ?? existing.difficulty,
        status: updates.status ?? existing.status,
        updatedAt: new Date(),
      })
      .where(eq(questions.id, id));
  } catch {}

  const idx = mockQuestionsStore.findIndex((q) => q.id === id);
  if (idx !== -1) {
    mockQuestionsStore[idx] = updated;
  }
  return updated;
}

export async function deleteQuestionRecord(id: number): Promise<boolean> {
  try {
    await db.delete(questions).where(eq(questions.id, id));
  } catch {}

  mockQuestionsStore = mockQuestionsStore.filter((q) => q.id !== id);
  return true;
}

export function getAllMockQuestions(): FullQuestion[] {
  return mockQuestionsStore;
}
