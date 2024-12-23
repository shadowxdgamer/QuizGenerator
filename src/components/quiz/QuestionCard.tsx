import { Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Pencil, Trash2 } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  number: number; // Prop for question number
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
}

export function QuestionCard({ question, number, onEdit, onDelete }: QuestionCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-primary">
            Question {number}: {question.text} {/* Add "Question {number}" */}
          </h3>
          <p className="text-sm text-muted-foreground">{t(`quiz.questionTypes.${question.type}`)}</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(question)}
            className="hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(question.id)}
            className="hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {question.code && (
          <pre className="mt-2 rounded-lg bg-muted/50 p-4 font-mono text-sm">
            <code>{question.code}</code>
          </pre>
        )}
        {question.options && (
          <ul className="mt-2 space-y-1">
            {question.options.map((option) => (
              <li
                key={option.id}
                className={`text-sm ${
                  option.isCorrect ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                • {option.text}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
