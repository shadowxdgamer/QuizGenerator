import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QuestionForm } from '@/components/QuestionForm';
import { Question } from '@/types/quiz';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuestionDialogProps {
  initialQuestion?: Question;
  onSubmit: (question: Omit<Question, 'id'>) => void;
}

export function QuestionDialog({ initialQuestion, onSubmit }: QuestionDialogProps) {
  const { t } = useLanguage();
  
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {initialQuestion ? t('quiz.editQuestion') : t('quiz.addQuestion')}
        </DialogTitle>
      </DialogHeader>
      <QuestionForm
        onSubmit={onSubmit}
        initialQuestion={initialQuestion}
      />
    </DialogContent>
  );
}