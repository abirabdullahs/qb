import { db } from '@/lib/db/client';
import { subjects, chapters, topics, subTopics, boards, groups, segments } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export interface SubjectItem {
  id: number;
  name: string;
  code?: string | null;
  chapters?: ChapterItem[];
}

export interface ChapterItem {
  id: number;
  subjectId: number;
  name: string;
  orderNo?: number | null;
  topics?: TopicItem[];
}

export interface TopicItem {
  id: number;
  chapterId: number;
  name: string;
  concept?: string | null;
  orderNo?: number | null;
  subTopics?: SubTopicItem[];
}

export interface SubTopicItem {
  id: number;
  topicId: number;
  name: string;
  orderNo?: number | null;
}

if (!(globalThis as any)._mockSubjectsStore) {
  (globalThis as any)._mockSubjectsStore = [
    {
      id: 1,
      name: 'পদার্থবিজ্ঞান ১ম পত্র (Physics 1st Paper)',
      code: 'PHY1',
      chapters: [
        {
          id: 101,
          subjectId: 1,
          name: 'অধ্যায় ১: ভৌত জগৎ ও পরিমাপ',
          orderNo: 1,
          topics: [
            {
              id: 1001,
              chapterId: 101,
              name: 'ভৌত রাশি ও পরিমাপের ত্রুটি',
              concept: 'পরিমাপের শতকরা ত্রুটি $\\delta = \\frac{\\Delta x}{x} \\times 100\\%$। আপেক্ষিক ত্রুটি = $\\frac{\\text{পরম ত্রুটি}}{\\text{প্রকৃত মান}}$',
              orderNo: 1,
            },
            {
              id: 1002,
              chapterId: 101,
              name: 'মাত্রা ও পরিমাপের একক',
              concept: 'যেকোনো ভৌত রাশির মাত্রা প্রকাশে মূল এককসমূহ $[M], [L], [T]$ ব্যবহার করা হয়। যেমন বল $[F] = [MLT^{-2}]$।',
              orderNo: 2,
            },
          ],
        },
        {
          id: 102,
          subjectId: 1,
          name: 'অধ্যায় ২: ভেক্টর (Vector)',
          orderNo: 2,
          topics: [
            {
              id: 1003,
              chapterId: 102,
              name: 'ভেক্টরের সামান্তরিক সূত্র',
              concept: 'লব্ধির মান $R = \\sqrt{P^2 + Q^2 + 2PQ \\cos \\alpha}$ এবং দিক $\\tan \\theta = \\frac{Q \\sin \\alpha}{P + Q \\cos \\alpha}$',
              orderNo: 1,
            },
            {
              id: 1004,
              chapterId: 102,
              name: 'ডট ও ক্রস গুণন (Dot & Cross Product)',
              concept: 'স্কেলার গুণন $\\vec{A} \\cdot \\vec{B} = AB \\cos \\theta$ এবং ভেক্টর গুণন $|\\vec{A} \\times \\vec{B}| = AB \\sin \\theta$',
              orderNo: 2,
            },
          ],
        },
        {
          id: 103,
          subjectId: 1,
          name: 'অধ্যায় ৩: গতিবিদ্যা (Dynamics)',
          orderNo: 3,
          topics: [
            {
              id: 1005,
              chapterId: 103,
              name: 'প্রাস (Projectile Motion)',
              concept: 'সর্বোচ্চ উচ্চতা $H = \\frac{v_0^2 \\sin^2 \\theta_0}{2g}$, বিচরণকাল $T = \\frac{2v_0 \\sin \\theta_0}{g}$, অনুভূমিক পাল্লা $R = \\frac{v_0^2 \\sin 2\\theta_0}{g}$',
              orderNo: 1,
            },
            { id: 1006, chapterId: 103, name: 'কৌণিক গতিবিদ্যা', concept: 'কৌণিক বেগ $\\omega = \\frac{d\\theta}{dt}$, রৈখিক বেগের সাথে সম্পর্ক $v = \\omega r$', orderNo: 2 },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'রসায়ন ১ম পত্র (Chemistry 1st Paper)',
      code: 'CHEM1',
      chapters: [
        {
          id: 201,
          subjectId: 2,
          name: 'অধ্যায় ১: গবেষণাগারের নিরাপদ ব্যবহার',
          orderNo: 1,
          topics: [{ id: 2001, chapterId: 201, name: 'গবেষণাগারের সুরক্ষা সরঞ্জাম', concept: 'নিরাপত্তা চশমা (Safety Goggles), অ্যাপ্রন এবং ফিউম হুড (Fume Hood) ব্যবহার বাধ্যতামূলক।', orderNo: 1 }],
        },
        {
          id: 202,
          subjectId: 2,
          name: 'অধ্যায় ২: গুণগত রসায়ন (Qualitative Chemistry)',
          orderNo: 2,
          topics: [
            {
              id: 2002,
              chapterId: 202,
              name: 'কোয়ান্টাম সংখ্যা (Quantum Numbers)',
              concept: 'প্রধান কোয়ান্টাম সংখ্যা $n$, সহকারী $l = 0$ থেকে $(n-1)$, চৌম্বকীয় $m = -l$ থেকে $+l$, এবং স্পিন $s = \\pm \\frac{1}{2}$',
              orderNo: 1,
            },
            {
              id: 2003,
              chapterId: 202,
              name: 'দ্রাব্যতা ও দ্রাব্যতা গুণফল (Ksp & Kp)',
              concept: 'স্বল্প দ্রবণীয় লবণ $A_x B_y \\rightleftharpoons xA^{y+} + yB^{x-}$ এর ক্ষেত্রে $K_{sp} = [A^{y+}]^x [B^{x-}]^y$',
              orderNo: 2,
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'উচ্চতর গণিত ১ম পত্র (Higher Math 1st Paper)',
      code: 'MATH1',
      chapters: [
        {
          id: 301,
          subjectId: 3,
          name: 'অধ্যায় ১: ম্যাট্রিক্স ও নির্ণায়ক (Matrix & Determinants)',
          orderNo: 1,
          topics: [
            {
              id: 3001,
              chapterId: 301,
              name: 'ক্রেমারের নিয়ম (Cramer Rule)',
              concept: '$x = \\frac{D_x}{D}, y = \\frac{D_y}{D}, z = \\frac{D_z}{D}$ যেখানে $D = \\begin{vmatrix} a_1 & b_1 \\\\ a_2 & b_2 \\end{vmatrix} \\neq 0$',
              orderNo: 1,
            },
          ],
        },
        {
          id: 302,
          subjectId: 3,
          name: 'অধ্যায় ৯: অন্তরীকরণ (Differentiation)',
          orderNo: 9,
          topics: [
            {
              id: 3002,
              chapterId: 302,
              name: 'মূল নিয়মে অন্তরজ',
              concept: '$\\frac{d}{dx}f(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$',
              orderNo: 1,
            },
          ],
        },
      ],
    },
  ];
}

const mockSubjects: SubjectItem[] = (globalThis as any)._mockSubjectsStore;

let mockBoards = [
  { id: 1, name: 'ঢাকা বোর্ড (Dhaka)', code: 'DHK' },
  { id: 2, name: 'রাজশাহী বোর্ড (Rajshahi)', code: 'RAJ' },
  { id: 3, name: 'কুমিল্লা বোর্ড (Comilla)', code: 'CUM' },
  { id: 4, name: 'যশোর বোর্ড (Jessore)', code: 'JES' },
  { id: 5, name: 'চট্টগ্রাম বোর্ড (Chittagong)', code: 'CHT' },
  { id: 6, name: 'বরিশাল বোর্ড (Barisal)', code: 'BAR' },
  { id: 7, name: 'সিলেট বোর্ড (Sylhet)', code: 'SYL' },
  { id: 8, name: 'দিনাজপুর বোর্ড (Dinajpur)', code: 'DIN' },
  { id: 9, name: 'ময়মনসিংহ বোর্ড (Mymensingh)', code: 'MYM' },
  { id: 10, name: 'মাদ্রাসা বোর্ড (Madrasah)', code: 'MAD' },
];

let mockGroups = [
  { id: 1, name: 'বিজ্ঞান (Science)', code: 'SCI' },
  { id: 2, name: 'মানবিক (Humanities)', code: 'HUM' },
  { id: 3, name: 'ব্যবসায় শিক্ষা (Business Studies)', code: 'BUS' },
];

let mockSegments = [
  { id: 1, name: 'SSC Academic', code: 'SSC', segmentKind: 'academic' },
  { id: 2, name: 'HSC Academic', code: 'HSC', segmentKind: 'academic' },
  { id: 3, name: 'Admission Test', code: 'ADM', segmentKind: 'admission' },
];

export async function getCurriculumTree(): Promise<SubjectItem[]> {
  try {
    const dbSubjects = await db.select().from(subjects);
    if (dbSubjects && dbSubjects.length > 0) {
      const result: SubjectItem[] = [];
      for (const s of dbSubjects) {
        const dbChaps = await db.select().from(chapters).where(eq(chapters.subjectId, s.id)).orderBy(asc(chapters.orderNo));
        const chapList: ChapterItem[] = [];
        for (const c of dbChaps) {
          const dbTops = await db.select().from(topics).where(eq(topics.chapterId, c.id)).orderBy(asc(topics.orderNo));
          chapList.push({ ...c, topics: dbTops });
        }
        result.push({ ...s, chapters: chapList });
      }
      return result;
    }
  } catch {
    // Fallback
  }
  return mockSubjects;
}

export async function getSubjects(): Promise<SubjectItem[]> {
  try {
    const res = await db.select().from(subjects);
    if (res && res.length > 0) return res;
  } catch {}
  return mockSubjects.map(({ chapters, ...s }) => s);
}

export async function createSubject(name: string, code?: string): Promise<SubjectItem> {
  const newSub: SubjectItem = {
    id: Date.now(),
    name,
    code: code || name.substring(0, 5).toUpperCase(),
    chapters: [],
  };
  try {
    const inserted = await db.insert(subjects).values({ name, code: newSub.code }).returning();
    if (inserted && inserted[0]) {
      return { ...inserted[0], chapters: [] };
    }
  } catch {}
  mockSubjects.push(newSub);
  return newSub;
}

export async function createChapter(subjectId: number, name: string, orderNo = 0): Promise<ChapterItem> {
  const newChap: ChapterItem = {
    id: Date.now(),
    subjectId,
    name,
    orderNo,
    topics: [],
  };
  try {
    const inserted = await db.insert(chapters).values({ subjectId, name, orderNo }).returning();
    if (inserted && inserted[0]) {
      return { ...inserted[0], topics: [] };
    }
  } catch {}

  const parentSubject = mockSubjects.find((s) => s.id === subjectId);
  if (parentSubject) {
    if (!parentSubject.chapters) parentSubject.chapters = [];
    parentSubject.chapters.push(newChap);
  }
  return newChap;
}

export async function createTopic(chapterId: number, name: string, concept?: string, orderNo = 0): Promise<TopicItem> {
  const newTop: TopicItem = {
    id: Date.now(),
    chapterId,
    name,
    concept: concept || null,
    orderNo,
    subTopics: [],
  };
  try {
    const inserted = await db.insert(topics).values({ chapterId, name, concept: concept || null, orderNo }).returning();
    if (inserted && inserted[0]) {
      return { ...inserted[0], subTopics: [] };
    }
  } catch {}

  for (const s of mockSubjects) {
    const c = s.chapters?.find((chap) => chap.id === chapterId);
    if (c) {
      if (!c.topics) c.topics = [];
      c.topics.push(newTop);
      break;
    }
  }
  return newTop;
}

export async function updateTopicConcept(topicId: number, concept: string): Promise<boolean> {
  try {
    await db.update(topics).set({ concept }).where(eq(topics.id, topicId));
  } catch {}

  for (const s of mockSubjects) {
    if (!s.chapters) continue;
    for (const c of s.chapters) {
      if (!c.topics) continue;
      const top = c.topics.find((t) => t.id === topicId);
      if (top) {
        top.concept = concept;
        return true;
      }
    }
  }
  return true;
}

export async function getBoards() {
  try {
    const res = await db.select().from(boards);
    if (res && res.length > 0) return res;
  } catch {}
  return mockBoards;
}

export async function getGroups() {
  try {
    const res = await db.select().from(groups);
    if (res && res.length > 0) return res;
  } catch {}
  return mockGroups;
}

export async function getSegments() {
  try {
    const res = await db.select().from(segments);
    if (res && res.length > 0) return res;
  } catch {}
  return mockSegments;
}
