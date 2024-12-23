export type QuestionType = 'text' | 'multiple-choice' | 'single-choice' | 'code-snippet';

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  correctAnswer?: string;
  code?: string;
  language?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}