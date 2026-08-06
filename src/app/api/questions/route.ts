import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { queryQuestions } from '@/domains/question/question.queries';
import { createQuestion } from '@/domains/question/question.service';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = {
      segmentId: searchParams.get('segmentId') ? Number(searchParams.get('segmentId')) : undefined,
      subjectId: searchParams.get('subjectId') ? Number(searchParams.get('subjectId')) : undefined,
      chapterId: searchParams.get('chapterId') ? Number(searchParams.get('chapterId')) : undefined,
      topicId: searchParams.get('topicId') ? Number(searchParams.get('topicId')) : undefined,
      questionType: (searchParams.get('questionType') as any) || undefined,
      difficulty: (searchParams.get('difficulty') as any) || undefined,
      status: (searchParams.get('status') as any) || undefined,
      year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
      tagId: searchParams.get('tagId') ? Number(searchParams.get('tagId')) : undefined,
      search: searchParams.get('search') || undefined,
      cursor: searchParams.get('cursor') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
    };

    const result = await queryQuestions(params);
    return apiSuccess(result, 'Questions fetched successfully');
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch questions', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return apiError('Unauthorized - Please sign in to create questions', 401);
    }

    const body = await req.json();
    body.contributorId = user.id;

    const result = await createQuestion(body);
    return apiSuccess(result, result.isDuplicate ? 'Question saved (Duplicate text detected)' : 'Question created successfully', 201);
  } catch (err: any) {
    return apiError(err.message || 'Failed to create question', 400);
  }
}
