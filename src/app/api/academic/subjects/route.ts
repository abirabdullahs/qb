import { NextRequest } from 'next/server';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { getSubjects, createSubject } from '@/lib/academic/service';
import { createSubjectSchema } from '@/lib/academic/schemas';

export async function GET() {
  try {
    const list = await getSubjects();
    return apiSuccess(list);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSubjectSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || 'Invalid input', 400);
    }
    const newSubject = await createSubject(parsed.data.name, parsed.data.code);
    return apiSuccess(newSubject, 'Subject created successfully', 201);
  } catch (err) {
    return handleApiError(err);
  }
}
