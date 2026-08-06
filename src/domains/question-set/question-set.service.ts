import {
  findAllQuestionSets,
  findQuestionSetById,
  insertQuestionSet,
  deleteQuestionSetRecord,
  QuestionSetRecord,
} from './question-set.repository';

export async function getQuestionSets(): Promise<QuestionSetRecord[]> {
  return await findAllQuestionSets();
}

export async function getQuestionSetDetails(id: number): Promise<QuestionSetRecord | null> {
  return await findQuestionSetById(id);
}

export async function createQuestionSet(
  name: string,
  negativeMarking: number,
  questionIds: number[]
): Promise<QuestionSetRecord> {
  if (!name.trim()) throw new Error('Question set name is required');
  return await insertQuestionSet(name, negativeMarking, questionIds);
}

export async function removeQuestionSet(id: number): Promise<boolean> {
  return await deleteQuestionSetRecord(id);
}
