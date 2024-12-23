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
  const [code, setCode] = useState(initialQuestion?.code || ''); // Optional code snippet

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      text,
      code: code || undefined,
      options: type === 'multiple-choice' || type === 'single-choice' ? options : undefined,
      correctAnswer: type === 'text' ? correctAnswer : undefined,
    });
  };

  const addOption = () => {
    setOptions([...options, { id: uuidv4(), text: '', code: '', isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, text?: string, code?: string, isCorrect?: boolean) => {
    const newOptions = [...options];
    newOptions[index] = {
      ...newOptions[index],
      ...(text !== undefined && { text }),
      ...(code !== undefined && { code }),
      ...(isCorrect !== undefined && { isCorrect }),
    };
    setOptions(newOptions);
  };

  return (
    <div
      className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded-md p-4"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#ce27b5 #e4c3f9' }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label>{t('quiz.questionTypes.text')}</Label>
          <RadioGroup
            value={type}
            onValueChange={(value) => setType(value as QuestionType)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="text" id="text" />
              <Label htmlFor="text">{t('quiz.questionTypes.text')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single-choice" id="single-choice" />
              <Label htmlFor="single-choice">
                {t('quiz.questionTypes.single-choice')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multiple-choice" id="multiple-choice" />
              <Label htmlFor="multiple-choice">
                {t('quiz.questionTypes.multiple-choice')}
              </Label>
            </div>
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

        <div className="space-y-4">
          <Label>{t('quiz.placeholders.optionalCode')}</Label>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t('quiz.placeholders.optionalCode')}
            className="font-mono"
          />
        </div>

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

        {(type === 'multiple-choice' || type === 'single-choice') && (
          <div className="space-y-4">
            <Label>{t('quiz.options')}</Label>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md p-2">
              {options.map((option, index) => (
                <div key={option.id} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    {type === 'multiple-choice' ? (
                      <Checkbox
                        checked={option.isCorrect}
                        onCheckedChange={(checked) =>
                          updateOption(index, undefined, undefined, !!checked)
                        }
                      />
                    ) : (
                      <RadioGroup value={options.findIndex((opt) => opt.isCorrect).toString()}>
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
                      className="flex-1"
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
                  <Textarea
                    value={option.code || ''}
                    onChange={(e) => updateOption(index, undefined, e.target.value)}
                    placeholder="Optional: Enter a code snippet for this option"
                    className="font-mono"
                  />
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
            >
              {t('common.add')}
            </Button>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button type="submit">{t('common.save')}</Button>
        </div>
      </form>
    </div>
  );
}
