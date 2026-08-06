import { z } from 'zod';

export const examTypeSchema = z.enum(['single_institute', 'cluster', 'centralized']);

export const createInstituteSchema = z.object({
  admissionSegmentId: z.number({ required_error: 'Admission segment is required' }),
  name: z.string().min(2, 'Institute name must be at least 2 characters'),
  shortName: z.string().optional(),
  location: z.string().optional(),
});

export const createAdmissionExamSchema = z.object({
  admissionSegmentId: z.number({ required_error: 'Admission segment is required' }),
  name: z.string().min(3, 'Exam name must be at least 3 characters'),
  examYear: z.number({ required_error: 'Exam year is required' }).min(2000).max(2100),
  conductingBody: z.string().optional(),
  examType: examTypeSchema,
  instituteId: z.number().nullable().optional(),
  negativeMarking: z.number().optional().default(0.25),
}).refine(
  (data) => {
    if (data.examType === 'single_institute' && !data.instituteId) {
      return false;
    }
    return true;
  },
  {
    message: 'Institute selection is mandatory for single-institute exam type',
    path: ['instituteId'],
  }
);

export const createAdmissionUnitSchema = z.object({
  admissionExamId: z.number({ required_error: 'Admission exam is required' }),
  unitName: z.string().min(1, 'Unit name is required'),
  description: z.string().optional(),
  instituteIds: z.array(z.number()).optional(),
});

export type CreateInstituteInput = z.infer<typeof createInstituteSchema>;
export type CreateAdmissionExamInput = z.infer<typeof createAdmissionExamSchema>;
export type CreateAdmissionUnitInput = z.infer<typeof createAdmissionUnitSchema>;
