import { NextRequest } from 'next/server';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { getAdmissionExams, createAdmissionExam } from '@/lib/admission/service';
import { createAdmissionExamSchema } from '@/lib/admission/schemas';

export async function GET() {
  try {
    const list = await getAdmissionExams();
    return apiSuccess(list);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createAdmissionExamSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || 'Invalid admission exam input', 400);
    }
    const newExam = await createAdmissionExam(parsed.data);
    return apiSuccess(newExam, 'Admission exam created successfully', 201);
  } catch (err) {
    return handleApiError(err);
  }
}
