import { NextRequest } from 'next/server';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { getInstitutes, createInstitute } from '@/lib/admission/service';
import { createInstituteSchema } from '@/lib/admission/schemas';

export async function GET() {
  try {
    const list = await getInstitutes();
    return apiSuccess(list);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createInstituteSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || 'Invalid institute input', 400);
    }
    const newInst = await createInstitute(
      parsed.data.admissionSegmentId,
      parsed.data.name,
      parsed.data.shortName,
      parsed.data.location
    );
    return apiSuccess(newInst, 'Institute registered successfully', 201);
  } catch (err) {
    return handleApiError(err);
  }
}
