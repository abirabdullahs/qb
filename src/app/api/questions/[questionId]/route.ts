import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getQuestion, updateQuestionStatus, deleteQuestion } from '@/domains/question/question.service';
import { getAuthUserFromRequest, canReviewQuestions, canEditQuestion } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ questionId: string }> }) {
  try {
    const { questionId } = await params;
    const qId = Number(questionId);
    const question = await getQuestion(qId);
    if (!question) {
      return apiError('Question not found', 404);
    }
    return apiSuccess(question, 'Question details fetched');
  } catch (err: any) {
    return apiError(err.message || 'Error fetching question', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ questionId: string }> }) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return apiError('Unauthorized - Please sign in', 401);
    }

    const { questionId } = await params;
    const qId = Number(questionId);
    const body = await req.json();

    const existing = await getQuestion(qId);
    if (!existing) {
      return apiError('Question not found', 404);
    }

    if (body.status) {
      if (!canReviewQuestions(user.role)) {
        return apiError('Forbidden - Moderator or Admin permissions required to update review status', 403);
      }
      const updated = await updateQuestionStatus(qId, body.status, user.id);
      return apiSuccess(updated, 'Question status updated');
    }

    if (!canEditQuestion(user, existing.contributorId || undefined)) {
      return apiError('Forbidden - You do not have permission to edit this question', 403);
    }

    return apiError('No valid update fields provided', 400);
  } catch (err: any) {
    return apiError(err.message || 'Error updating question', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ questionId: string }> }) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return apiError('Unauthorized - Please sign in', 401);
    }

    if (!canReviewQuestions(user.role) && user.role !== 'admin') {
      return apiError('Forbidden - Only moderators and admins can delete questions', 403);
    }

    const { questionId } = await params;
    const qId = Number(questionId);
    await deleteQuestion(qId);
    return apiSuccess({ success: true }, 'Question deleted');
  } catch (err: any) {
    return apiError(err.message || 'Error deleting question', 500);
  }
}
