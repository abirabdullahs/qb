import { apiSuccess, handleApiError } from '@/lib/api-response';
import { getBoards } from '@/lib/academic/service';

export async function GET() {
  try {
    const data = await getBoards();
    return apiSuccess(data);
  } catch (err) {
    return handleApiError(err);
  }
}
