import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getAllTags } from '@/domains/tag/tag.service';

export async function GET() {
  try {
    const tags = await getAllTags();
    return apiSuccess(tags, 'Tags fetched successfully');
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch tags', 500);
  }
}
