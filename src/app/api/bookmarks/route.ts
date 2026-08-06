import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/api-response';
import {
  getUserBookmarkedIds,
  getUserBookmarkedQuestions,
  toggleBookmark,
} from '@/domains/bookmark/bookmark.service';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return apiError('Unauthorized: Please log in to view bookmarks', 401);
  }

  try {
    const ids = await getUserBookmarkedIds(user.id);
    const questions = await getUserBookmarkedQuestions(user.id);
    return apiSuccess({ bookmarkedIds: ids, questions }, 'Bookmarks fetched');
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch bookmarks', 500);
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return apiError('Unauthorized: Please log in or register to bookmark questions', 401);
  }

  try {
    const { questionId } = await req.json();
    if (!questionId) {
      return apiError('questionId is required', 400);
    }

    const result = await toggleBookmark(user.id, Number(questionId));
    return apiSuccess(result, result.isBookmarked ? 'Question bookmarked' : 'Bookmark removed');
  } catch (err: any) {
    return apiError(err.message || 'Failed to toggle bookmark', 500);
  }
}
