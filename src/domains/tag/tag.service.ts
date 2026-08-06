import { findAllTags, findOrCreateTag, attachTagsToQuestion, getTagsForQuestion, TagRecord } from './tag.repository';

export async function getAllTags(): Promise<TagRecord[]> {
  return await findAllTags();
}

export async function ensureTagByName(name: string): Promise<TagRecord> {
  return await findOrCreateTag(name);
}

export async function linkTagsToQuestion(questionId: number, tagNamesOrIds: (string | number)[]): Promise<boolean> {
  const tagIds: number[] = [];
  for (const item of tagNamesOrIds) {
    if (typeof item === 'number') {
      tagIds.push(item);
    } else if (typeof item === 'string' && item.trim().length > 0) {
      const tag = await findOrCreateTag(item.trim());
      tagIds.push(tag.id);
    }
  }
  return await attachTagsToQuestion(questionId, tagIds);
}

export async function fetchQuestionTags(questionId: number): Promise<TagRecord[]> {
  return await getTagsForQuestion(questionId);
}
