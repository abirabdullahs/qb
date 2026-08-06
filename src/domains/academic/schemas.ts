import { z } from 'zod';

export const createSubjectSchema = z.object({
  name: z.string().min(2, 'Subject name must be at least 2 characters'),
  code: z.string().optional(),
  groupIds: z.array(z.number()).optional(),
});

export const createChapterSchema = z.object({
  subjectId: z.number({ required_error: 'Subject is required' }),
  name: z.string().min(2, 'Chapter name must be at least 2 characters'),
  orderNo: z.number().optional().default(0),
});

export const createTopicSchema = z.object({
  chapterId: z.number({ required_error: 'Chapter is required' }),
  name: z.string().min(2, 'Topic name must be at least 2 characters'),
  orderNo: z.number().optional().default(0),
});

export const createSubTopicSchema = z.object({
  topicId: z.number({ required_error: 'Topic is required' }),
  name: z.string().min(2, 'Sub-topic name must be at least 2 characters'),
  orderNo: z.number().optional().default(0),
});

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type CreateChapterInput = z.infer<typeof createChapterSchema>;
export type CreateTopicInput = z.infer<typeof createTopicSchema>;
export type CreateSubTopicInput = z.infer<typeof createSubTopicSchema>;
