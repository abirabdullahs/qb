import { NextRequest } from 'next/server';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { createChapter } from '@/lib/academic/service';
import { createChapterSchema } from '@/lib/academic/schemas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createChapterSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || 'Invalid input', 400);
    }
    const newChapter = await createChapter(parsed.data.subjectId, parsed.data.name, parsed.data.orderNo);
    return apiSuccess(newChapter, 'Chapter created successfully', 201);
  } catch (err) {
    return handleApiError(err);
  }
}
