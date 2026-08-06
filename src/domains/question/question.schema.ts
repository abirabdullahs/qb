import { z } from 'zod';

export const questionTypeEnum = z.enum(['mcq', 'cq', 'written']);
export const difficultyEnum = z.enum(['easy', 'medium', 'hard']);
export const statusEnum = z.enum(['draft', 'pending', 'approved', 'rejected']);
export const cqStyleEnum = z.enum(['standard_4_part', 'custom']).optional();

export const baseQuestionSchema = z.object({
  // Branch mode: 'academic' or 'admission'
  branchType: z.enum(['academic', 'admission']).default('academic'),

  // Academic branch fields
  segmentId: z.number().nullable().optional(),
  groupId: z.number().nullable().optional(),
  subjectId: z.number({ required_error: 'Subject is required' }),
  chapterId: z.number().nullable().optional(),
  topicId: z.number().nullable().optional(),
  subTopicId: z.number().nullable().optional(),

  // Admission branch fields
  admissionSegmentId: z.number().nullable().optional(),
  admissionExamId: z.number().nullable().optional(),
  admissionUnitId: z.number().nullable().optional(),
  instituteId: z.number().nullable().optional(),

  // Question details
  questionType: questionTypeEnum,
  stimulusText: z.string().nullable().optional(),
  questionText: z.string().min(3, 'Question text must be at least 3 characters'),
  hasMath: z.boolean().default(false),
  cqStyle: cqStyleEnum,
  year: z.number().nullable().optional(),
  examName: z.string().nullable().optional(),
  isPreviousYear: z.boolean().default(false),
  marks: z.number().default(1),
  difficulty: difficultyEnum.default('medium'),
  language: z.enum(['bn', 'en']).default('bn'),
  answerText: z.string().nullable().optional(),
  explanationText: z.string().nullable().optional(),
  videoSolutionUrl: z.string().nullable().optional(),
  status: statusEnum.default('pending'),
  contributorId: z.number().nullable().optional(),
  reviewedBy: z.number().nullable().optional(),

  // Related data arrays
  boardIds: z.array(z.number()).optional().default([]),
  tagIds: z.array(z.number()).optional().default([]),
}).refine(
  (data) => {
    // FIX-06: chk_academic_or_admission
    // Must not populate both academic segmentId and admissionSegmentId simultaneously
    if (data.branchType === 'academic') {
      if (data.admissionSegmentId || data.admissionExamId) {
        return false;
      }
    } else if (data.branchType === 'admission') {
      if (data.segmentId) {
        return false;
      }
    }
    return true;
  },
  {
    message: 'A question cannot have both Academic and Admission branch fields filled',
    path: ['branchType'],
  }
);

export type BaseQuestionInput = z.infer<typeof baseQuestionSchema>;
