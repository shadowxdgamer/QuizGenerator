import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Download, Moon, Plus, Shuffle, Sun } from 'lucide-react';

interface QuizHeaderProps {
  onAddQuestion: () => void;
  onDownload: () => void;
  onRandomize: () => void;
}

export function QuizHeader({ onAddQuestion, onDownload, onRandomize }: QuizHeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 mb-8 backdrop-blur-sm">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t('quiz.title')}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="font-semibold"
          >
            {language.toUpperCase()}
          </Button>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          <Button variant="outline" onClick={onRandomize} className="gap-2">
            <Shuffle className="h-4 w-4" />
            {t('quiz.randomize')}
          </Button>
          <Button variant="outline" onClick={onDownload} className="gap-2">
            <Download className="h-4 w-4" />
            {t('common.download')}
          </Button>
          <Button onClick={onAddQuestion} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('quiz.addQuestion')}
          </Button>
        </div>
      </div>
    </header>
  );
}