import { generateDuplicateHash } from './duplicate-hash';
import { containsMath } from '../content/math';
import { baseQuestionSchema, BaseQuestionInput } from './question.schema';
import {
  FullQuestion,
  findQuestionById,
  findQuestionByHash,
  insertQuestionRecord,
  updateQuestionRecord,
  deleteQuestionRecord,
} from './question.repository';
import { MCQOptionInput } from './mcq.schema';
import { CQSubPartInput } from './cq.schema';

import { createAttachmentRecord, getAttachmentsForEntity } from '../attachment/attachment.repository';
import { linkTagsToQuestion, fetchQuestionTags } from '../tag/tag.service';

export interface CreateQuestionPayload extends BaseQuestionInput {
  options?: MCQOptionInput[];
  subParts?: CQSubPartInput[];
  attachments?: any[];
  tags?: string[];
}

export async function createQuestion(payload: CreateQuestionPayload): Promise<{ question: FullQuestion; isDuplicate: boolean }> {
  // Validate base schema
  const validated = baseQuestionSchema.parse(payload);

  // Compute duplicate hash from questionText or stimulusText
  const fullTextToHash = `${validated.stimulusText || ''} ${validated.questionText}`;
  const hash = generateDuplicateHash(fullTextToHash);

  // Check duplicate
  const existingDuplicate = await findQuestionByHash(hash);
  const isDuplicate = !!existingDuplicate;

  // Auto detect LaTeX math presence
  const hasMath =
    containsMath(validated.questionText) ||
    containsMath(validated.stimulusText || '') ||
    containsMath(validated.explanationText || '') ||
    payload.options?.some((o) => containsMath(o.optionText)) ||
    payload.subParts?.some((sp) => containsMath(sp.partText) || containsMath(sp.answerText || ''));

  // Prepare full question object
  const questionRecord: FullQuestion = {
    ...validated,
    id: 0,
    hasMath: hasMath || validated.hasMath,
    duplicateHash: hash,
    options: payload.options || [],
    subParts: payload.subParts || [],
    status: validated.status || 'pending',
    branchType: validated.branchType || 'academic',
    attachments: payload.attachments || [],
  };

  const created = await insertQuestionRecord(questionRecord);

  if (payload.attachments && payload.attachments.length > 0) {
    for (const att of payload.attachments) {
      await createAttachmentRecord({
        attachableType: 'question',
        attachableId: created.id,
        imageUrl: att.url || att.imageUrl,
        altText: att.altText,
      });
    }
  }

  if (payload.tags && payload.tags.length > 0) {
    await linkTagsToQuestion(created.id, payload.tags);
  }

  return { question: created, isDuplicate };
}

export async function getQuestion(id: number): Promise<FullQuestion | null> {
  const q = await findQuestionById(id);
  if (q) {
    const atts = await getAttachmentsForEntity('question', id);
    if (atts.length > 0) {
      q.attachments = atts;
    }
    const questionTags = await fetchQuestionTags(id);
    if (questionTags.length > 0) {
      (q as any).tags = questionTags.map((t) => t.name);
    }
  }
  return q;
}

export async function updateQuestionStatus(id: number, status: 'approved' | 'rejected' | 'pending', reviewedBy?: number): Promise<FullQuestion | null> {
  return await updateQuestionRecord(id, { status, reviewedBy });
}

export async function approveQuestion(id: number, reviewerId?: number): Promise<FullQuestion | null> {
  return await updateQuestionRecord(id, { status: 'approved', reviewedBy: reviewerId });
}

export async function rejectQuestion(id: number, reviewerId?: number): Promise<FullQuestion | null> {
  return await updateQuestionRecord(id, { status: 'rejected', reviewedBy: reviewerId });
}

export async function deleteQuestion(id: number): Promise<boolean> {
  return await deleteQuestionRecord(id);
}
