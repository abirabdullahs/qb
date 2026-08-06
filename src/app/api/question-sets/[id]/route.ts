import { NextRequest, NextResponse } from 'next/server';
import { getQuestionSetDetails, removeQuestionSet } from '@/domains/question-set/question-set.service';
import { getAuthUserFromRequest, canManageTaxonomy } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const setId = Number(id);
    if (!setId) {
      return NextResponse.json({ success: false, error: 'Invalid question set ID' }, { status: 400 });
    }
    const setDetails = await getQuestionSetDetails(setId);
    if (!setDetails) {
      return NextResponse.json({ success: false, error: 'Question set not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: setDetails });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized - Please sign in' }, { status: 401 });
    }
    if (!canManageTaxonomy(user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden - Insufficient permissions to delete question sets' }, { status: 403 });
    }

    const { id } = await params;
    const setId = Number(id);
    if (!setId) {
      return NextResponse.json({ success: false, error: 'Invalid question set ID' }, { status: 400 });
    }
    const deleted = await removeQuestionSet(setId);
    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

