import { createContext, useContext, useState, ReactNode } from 'react';
import { Quiz, Question } from '@/types/quiz';
import { v4 as uuidv4 } from 'uuid';

interface QuizContextType {
  quiz: Quiz;
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, question: Partial<Question>) => void;
  removeQuestion: (id: string) => void;
  randomizeQuestions: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quiz, setQuiz] = useState<Quiz>({
    id: uuidv4(),
    title: 'New Quiz',
    questions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const addQuestion = (question: Omit<Question, 'id'>) => {
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...question, id: uuidv4() }],
      updatedAt: new Date(),
    }));
  };

  const updateQuestion = (id: string, question: Partial<Question>) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, ...question } : q
      ),
      updatedAt: new Date(),
    }));
  };

  const removeQuestion = (id: string) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
      updatedAt: new Date(),
    }));
  };

  const randomizeQuestions = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions].sort(() => Math.random() - 0.5),
      updatedAt: new Date(),
    }));
  };

  return (
    <QuizContext.Provider
      value={{ quiz, addQuestion, updateQuestion, removeQuestion, randomizeQuestions }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}