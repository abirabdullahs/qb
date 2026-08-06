import { NextRequest } from 'next/server';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { createTopic } from '@/lib/academic/service';
import { createTopicSchema } from '@/lib/academic/schemas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createTopicSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || 'Invalid input', 400);
    }
    const newTopic = await createTopic(parsed.data.chapterId, parsed.data.name, parsed.data.orderNo);
    return apiSuccess(newTopic, 'Topic created successfully', 201);
  } catch (err) {
    return handleApiError(err);
  }
}
