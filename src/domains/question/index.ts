// Question domain entrypoint for Phase 4
export interface BaseQuestion {
  id: number;
  questionText: string;
  questionType: 'mcq' | 'cq' | 'written';
  difficulty?: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
}
