import { NextRequest, NextResponse } from 'next/server';
import { getQuestionSets, createQuestionSet } from '@/domains/question-set/question-set.service';

export async function GET() {
  try {
    const sets = await getQuestionSets();
    return NextResponse.json({ success: true, data: sets });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, negativeMarking, questionIds } = body;
    const created = await createQuestionSet(name, Number(negativeMarking) || 0, questionIds || []);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
