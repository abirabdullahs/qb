import { z } from 'zod';

export const mcqOptionSchema = z.object({
  id: z.number().optional(),
  optionLabel: z.string().min(1, 'Option label is required'),
  optionText: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean().default(false),
  explanationText: z.string().nullable().optional(),
  orderNo: z.number().default(0),
});

export const mcqQuestionSchema = z.object({
  options: z
    .array(mcqOptionSchema)
    .min(2, 'MCQ must have at least 2 options')
    .max(5, 'MCQ can have at most 5 options')
    .refine((opts) => opts.some((o) => o.isCorrect), {
      message: 'At least one option must be marked as correct',
    }),
});

export type MCQOptionInput = z.infer<typeof mcqOptionSchema>;
export type MCQQuestionInput = z.infer<typeof mcqQuestionSchema>;
