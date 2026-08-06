import { apiSuccess, handleApiError } from '@/lib/api-response';
import { getCurriculumTree } from '@/lib/academic/service';

export async function GET() {
  try {
    const tree = await getCurriculumTree();
    return apiSuccess(tree);
  } catch (err) {
    return handleApiError(err);
  }
}
