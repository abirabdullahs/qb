import { apiSuccess, handleApiError } from '@/lib/api-response';
import { getGroups } from '@/lib/academic/service';

export async function GET() {
  try {
    const data = await getGroups();
    return apiSuccess(data);
  } catch (err) {
    return handleApiError(err);
  }
}
