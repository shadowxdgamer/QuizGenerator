import { useState } from 'react';
import { Question, QuestionType } from '@/types/quiz';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { v4 as uuidv4 } from 'uuid';

interface QuestionFormProps {
  onSubmit: (question: Omit<Question, 'id'>) => void;
  initialQuestion?: Question;
}

export function QuestionForm({ onSubmit, initialQuestion }: QuestionFormProps) {
  const { t } = useLanguage();
  const [type, setType] = useState<QuestionType>(initialQuestion?.type || 'text');
  const [text, setText] = useState(initialQuestion?.text || '');
  const [options, setOptions] = useState(initialQuestion?.options || []);
  const [correctAnswer, setCorrectAnswer] = useState(initialQuestion?.correctAnswer || '');
  const [code, setCode] = useState(initialQuestion?.code || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      text,
      options: type === 'multiple-choice' || type === 'single-choice' ? options : undefined,
      correctAnswer: type === 'text' ? correctAnswer : undefined,
      code: type === 'code-snippet' ? code : undefined,
    });
  };

  const addOption = () => {
    setOptions([...options, { id: uuidv4(), text: '', isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, text: string, isCorrect?: boolean) => {
    const newOptions = [...options];
    newOptions[index] = {
      ...newOptions[index],
      text,
      ...(isCorrect !== undefined && { isCorrect }),
    };
    setOptions(newOptions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>{t('quiz.questionTypes.text')}</Label>
        <RadioGroup
          value={type}
          onValueChange={(value) => setType(value as QuestionType)}
          className="grid grid-cols-2 gap-4"
        >
          {Object.entries(t('quiz.questionTypes')).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem value={key} id={key} />
              <Label htmlFor={key}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>{t('quiz.placeholders.questionText')}</Label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('quiz.placeholders.questionText')}
          required
        />
      </div>

      {type === 'code-snippet' && (
        <div className="space-y-4">
          <Label>Code</Label>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code snippet"
            className="font-mono"
            required
          />
        </div>
      )}

      {(type === 'multiple-choice' || type === 'single-choice') && (
        <div className="space-y-4">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center space-x-2">
              {type === 'multiple-choice' ? (
                <Checkbox
                  checked={option.isCorrect}
                  onCheckedChange={(checked) => updateOption(index, option.text, !!checked)}
                />
              ) : (
                <RadioGroup value={options.findIndex(opt => opt.isCorrect).toString()}>
                  <RadioGroupItem
                    value={index.toString()}
                    onClick={() => {
                      const newOptions = options.map((opt, i) => ({
                        ...opt,
                        isCorrect: i === index,
                      }));
                      setOptions(newOptions);
                    }}
                  />
                </RadioGroup>
              )}
              <Input
                value={option.text}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={t('quiz.placeholders.optionText')}
                required
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeOption(index)}
              >
                ×
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addOption}
          >
            {t('common.add')}
          </Button>
        </div>
      )}

      {type === 'text' && (
        <div className="space-y-4">
          <Label>{t('quiz.placeholders.answerText')}</Label>
          <Input
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder={t('quiz.placeholders.answerText')}
            required
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="submit">{t('common.save')}</Button>
      </div>
    </form>
  );
}