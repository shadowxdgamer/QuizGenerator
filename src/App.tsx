import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { QuizProvider } from '@/contexts/QuizContext';
import { QuizGenerator } from '@/components/QuizGenerator';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <QuizProvider>
          <QuizGenerator />
          <Toaster />
        </QuizProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;