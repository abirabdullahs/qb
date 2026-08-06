import { apiSuccess, handleApiError } from '@/lib/api-response';
import { getAdmissionSegments } from '@/lib/admission/service';

export async function GET() {
  try {
    const list = await getAdmissionSegments();
    return apiSuccess(list);
  } catch (err) {
    return handleApiError(err);
  }
}
