import { useState } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizHeader } from '@/components/quiz/QuizHeader';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { QuestionDialog } from '@/components/quiz/QuestionDialog';
import { Dialog } from '@/components/ui/dialog';
import { Question } from '@/types/quiz';
import { Toaster } from '@/components/ui/toaster';
import { downloadQuiz } from '@/lib/quiz-utils';

export function QuizGenerator() {
  const { quiz, addQuestion, removeQuestion, randomizeQuestions } = useQuiz();
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleQuestionSubmit = (question: Omit<Question, 'id'>) => {
    addQuestion(question);
    setEditingQuestion(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <QuizHeader
          onAddQuestion={() => setIsDialogOpen(true)}
          onDownload={() => downloadQuiz(quiz)}
          onRandomize={randomizeQuestions}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quiz.questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              number={index + 1} // Pass question number
              onEdit={(q) => {
                setEditingQuestion(q);
                setIsDialogOpen(true);
              }}
              onDelete={removeQuestion}
            />
          ))}
        </div>


        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <QuestionDialog
            initialQuestion={editingQuestion || undefined}
            onSubmit={handleQuestionSubmit}
          />
        </Dialog>

        <Toaster />
      </div>
    </div>
  );
}
