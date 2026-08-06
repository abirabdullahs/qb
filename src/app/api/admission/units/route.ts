import { NextRequest } from 'next/server';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { createAdmissionUnit } from '@/lib/admission/service';
import { createAdmissionUnitSchema } from '@/lib/admission/schemas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createAdmissionUnitSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || 'Invalid unit input', 400);
    }
    const newUnit = await createAdmissionUnit(
      parsed.data.admissionExamId,
      parsed.data.unitName,
      parsed.data.description
    );
    return apiSuccess(newUnit, 'Cluster unit added successfully', 201);
  } catch (err) {
    return handleApiError(err);
  }
}
