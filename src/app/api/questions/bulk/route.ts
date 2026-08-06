import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { createQuestion, CreateQuestionPayload } from '@/domains/question/question.service';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return apiError('Unauthorized - Please sign in to perform bulk upload', 401);
    }

    const body = await req.json();
    let questionsList: CreateQuestionPayload[] = [];

    if (Array.isArray(body)) {
      questionsList = body;
    } else if (body && Array.isArray(body.questions)) {
      questionsList = body.questions;
    } else {
      return apiError('Invalid request format. Expected a JSON array of questions or an object with a "questions" array.', 400);
    }

    if (questionsList.length === 0) {
      return apiError('No questions provided in JSON array.', 400);
    }

    if (questionsList.length > 200) {
      return apiError('Bulk upload limit exceeded. Maximum 200 questions per request.', 400);
    }

    const results: Array<{ index: number; success: boolean; id?: number; isDuplicate?: boolean; error?: string }> = [];
    let createdCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    for (let i = 0; i < questionsList.length; i++) {
      const qPayload = questionsList[i];
      try {
        const itemWithContributor = {
          ...qPayload,
          contributorId: user.id,
        };
        const { question, isDuplicate } = await createQuestion(itemWithContributor);
        if (isDuplicate) duplicateCount++;
        createdCount++;
        results.push({
          index: i,
          success: true,
          id: question.id,
          isDuplicate,
        });
      } catch (err: any) {
        errorCount++;
        results.push({
          index: i,
          success: false,
          error: err.message || 'Validation or processing error',
        });
      }
    }

    return apiSuccess(
      {
        total: questionsList.length,
        createdCount,
        duplicateCount,
        errorCount,
        results,
      },
      `Bulk upload complete: ${createdCount} processed successfully (${duplicateCount} duplicate hashes detected), ${errorCount} errors.`,
      200
    );
  } catch (err: any) {
    return apiError(err.message || 'Failed to process bulk upload JSON', 400);
  }
}
