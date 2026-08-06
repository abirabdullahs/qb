import { db } from '@/lib/db/client';
import { admissionSegments, institutes, admissionExams, admissionUnits } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface AdmissionSegment {
  id: number;
  name: string;
  code?: string | null;
}

export interface Institute {
  id: number;
  admissionSegmentId: number;
  name: string;
  shortName?: string | null;
  location?: string | null;
}

export interface AdmissionExam {
  id: number;
  admissionSegmentId: number;
  name: string;
  examYear: number;
  conductingBody?: string | null;
  examType: 'single_institute' | 'cluster' | 'centralized';
  instituteId?: number | null;
  negativeMarking?: number | string | null;
  units?: AdmissionUnit[];
}

export interface AdmissionUnit {
  id: number;
  admissionExamId: number;
  unitName: string;
  description?: string | null;
  institutes?: Institute[];
}

let mockSegments: AdmissionSegment[] = [
  { id: 1, name: 'Engineering & Technology', code: 'ENG' },
  { id: 2, name: 'Medical & Dental (DGHS)', code: 'MED' },
  { id: 3, name: 'General University (Varsity)', code: 'VAR' },
];

let mockInstitutes: Institute[] = [
  { id: 1, admissionSegmentId: 1, name: 'Bangladesh University of Engineering and Technology', shortName: 'BUET', location: 'Dhaka' },
  { id: 2, admissionSegmentId: 1, name: 'Chittagong University of Engineering & Technology', shortName: 'CUET', location: 'Chittagong' },
  { id: 3, admissionSegmentId: 2, name: 'Dhaka Medical College', shortName: 'DMC', location: 'Dhaka' },
  { id: 4, admissionSegmentId: 3, name: 'University of Dhaka', shortName: 'DU', location: 'Dhaka' },
  { id: 5, admissionSegmentId: 3, name: 'Jagannath University (GST Member)', shortName: 'JnU', location: 'Dhaka' },
];

let mockExams: AdmissionExam[] = [
  {
    id: 1,
    admissionSegmentId: 1,
    name: 'BUET Admission Test 2026',
    examYear: 2026,
    conductingBody: 'BUET',
    examType: 'single_institute',
    instituteId: 1,
    negativeMarking: 0.25,
  },
  {
    id: 2,
    admissionSegmentId: 2,
    name: 'MBBS Centralized Admission Test 2026',
    examYear: 2026,
    conductingBody: 'DGHS',
    examType: 'centralized',
    instituteId: null,
    negativeMarking: 0.25,
  },
  {
    id: 3,
    admissionSegmentId: 3,
    name: 'GST Guccho Cluster Admission 2026',
    examYear: 2026,
    conductingBody: 'GST Committee',
    examType: 'cluster',
    instituteId: null,
    negativeMarking: 0.25,
    units: [
      { id: 101, admissionExamId: 3, unitName: 'A Unit', description: 'Science Background Unit' },
      { id: 102, admissionExamId: 3, unitName: 'B Unit', description: 'Humanities Background Unit' },
      { id: 103, admissionExamId: 3, unitName: 'C Unit', description: 'Commerce Background Unit' },
    ],
  },
];

export async function getAdmissionSegments(): Promise<AdmissionSegment[]> {
  try {
    const res = await db.select().from(admissionSegments);
    if (res && res.length > 0) return res;
  } catch {}
  return mockSegments;
}

export async function getInstitutes(): Promise<Institute[]> {
  try {
    const res = await db.select().from(institutes);
    if (res && res.length > 0) return res;
  } catch {}
  return mockInstitutes;
}

export async function createInstitute(admissionSegmentId: number, name: string, shortName?: string, location?: string): Promise<Institute> {
  const newInst: Institute = {
    id: Date.now(),
    admissionSegmentId,
    name,
    shortName: shortName || null,
    location: location || null,
  };
  try {
    const inserted = await db.insert(institutes).values({ admissionSegmentId, name, shortName, location }).returning();
    if (inserted && inserted[0]) return inserted[0];
  } catch {}

  mockInstitutes.push(newInst);
  return newInst;
}

export async function getAdmissionExams(): Promise<AdmissionExam[]> {
  try {
    const dbExams = await db.select().from(admissionExams);
    if (dbExams && dbExams.length > 0) {
      const result: AdmissionExam[] = [];
      for (const ex of dbExams) {
        const units = await db.select().from(admissionUnits).where(eq(admissionUnits.admissionExamId, ex.id));
        result.push({ ...ex, examType: ex.examType as any, units });
      }
      return result;
    }
  } catch {}
  return mockExams;
}

export async function createAdmissionExam(data: {
  admissionSegmentId: number;
  name: string;
  examYear: number;
  conductingBody?: string;
  examType: 'single_institute' | 'cluster' | 'centralized';
  instituteId?: number | null;
  negativeMarking?: number;
}): Promise<AdmissionExam> {
  const newExam: AdmissionExam = {
    id: Date.now(),
    admissionSegmentId: data.admissionSegmentId,
    name: data.name,
    examYear: data.examYear,
    conductingBody: data.conductingBody || null,
    examType: data.examType,
    instituteId: data.instituteId || null,
    negativeMarking: data.negativeMarking ?? 0.25,
    units: [],
  };

  try {
    const inserted = await db
      .insert(admissionExams)
      .values({
        admissionSegmentId: data.admissionSegmentId,
        name: data.name,
        examYear: data.examYear,
        conductingBody: data.conductingBody,
        examType: data.examType,
        instituteId: data.instituteId || null,
        negativeMarking: String(data.negativeMarking ?? 0.25),
      })
      .returning();
    if (inserted && inserted[0]) {
      return { ...inserted[0], examType: inserted[0].examType as any, units: [] };
    }
  } catch {}

  mockExams.push(newExam);
  return newExam;
}

export async function createAdmissionUnit(admissionExamId: number, unitName: string, description?: string): Promise<AdmissionUnit> {
  const newUnit: AdmissionUnit = {
    id: Date.now(),
    admissionExamId,
    unitName,
    description: description || null,
  };

  try {
    const inserted = await db.insert(admissionUnits).values({ admissionExamId, unitName, description }).returning();
    if (inserted && inserted[0]) return inserted[0];
  } catch {}

  const targetExam = mockExams.find((e) => e.id === admissionExamId);
  if (targetExam) {
    if (!targetExam.units) targetExam.units = [];
    targetExam.units.push(newUnit);
  }
  return newUnit;
}
