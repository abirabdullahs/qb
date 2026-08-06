import { z } from 'zod';

export const cognitiveLevelEnum = z.enum(['knowledge', 'comprehension', 'application', 'higher_ability']);

export const cqSubPartSchema = z.object({
  id: z.number().optional(),
  partLabel: z.string().min(1, 'Part label is required'),
  partText: z.string().min(1, 'Part text is required'),
  marks: z.number().min(0.5, 'Marks must be at least 0.5'),
  cognitiveLevel: cognitiveLevelEnum.nullable().optional(),
  answerText: z.string().nullable().optional(),
  explanationText: z.string().nullable().optional(),
  orderNo: z.number().default(0),
});

export const cqQuestionSchema = z.object({
  stimulusText: z.string().min(3, 'Stimulus (উদ্দীপক) is required for Creative Questions'),
  subParts: z
    .array(cqSubPartSchema)
    .min(1, 'CQ must have at least 1 sub-part')
    .max(6, 'CQ can have at most 6 sub-parts'),
});

export type CQSubPartInput = z.infer<typeof cqSubPartSchema>;
export type CQQuestionInput = z.infer<typeof cqQuestionSchema>;
