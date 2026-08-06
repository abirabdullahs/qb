import { apiSuccess, handleApiError } from '@/lib/api-response';
import { getSegments } from '@/lib/academic/service';

export async function GET() {
  try {
    const data = await getSegments();
    return apiSuccess(data);
  } catch (err) {
    return handleApiError(err);
  }
}
