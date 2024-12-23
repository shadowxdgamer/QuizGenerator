import { translations, Language } from '../i18n/translations'; // Import translations and language types

function generateQuizHtml(quiz: any, language: Language = 'en'): string {
  const t = translations[language]?.quiz || translations.en.quiz; // Fallback to English

  if (!t) {
    console.error(`Missing translations for language: ${language}`);
    throw new Error(`Translations for language "${language}" are not defined.`);
  }

  return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${quiz.title || t.title}</title>
  <script src="quiz.js" defer></script>
  <style>
    :root {
      --text: #230117;
      --background: #e4c3f9;
      --primary: #ce27b5;
      --secondary: #ae1369;
      --accent: #7d1252;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --text: #fedcf2;
        --background: #27063c;
        --primary: #d831bf;
        --secondary: #ec51a6;
        --accent: #ed82c2;
      }
    }
    body {
      font-family: system-ui, sans-serif;
      background: var(--background);
      color: var(--text);
      margin: 0;
      padding: 2rem;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    .question {
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
    .question h3 {
      margin: 0;
    }
    .question-number {
      font-weight: bold;
      color: var(--primary);
    }
    .code {
      background: rgba(0, 0, 0, 0.1);
      padding: 1rem;
      border-radius: 4px;
      font-family: monospace;
      overflow-x: auto;
      margin: 1rem 0;
    }
    input[type="text"], textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--accent);
      border-radius: 8px;
      margin-top: 0.5rem;
      font-size: 1rem;
      color: var(--text);
      background: var(--background);
      transition: border-color 0.3s ease-in-out;
    }
    input[type="text"]:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
    }
    input[type="radio"], input[type="checkbox"] {
      appearance: none;
      width: 20px;
      height: 20px;
      border: 2px solid var(--accent);
      border-radius: 50%;
      display: inline-block;
      margin-right: 0.5rem;
      vertical-align: middle;
      cursor: pointer;
      transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
    }
    input[type="checkbox"] {
      border-radius: 4px;
    }
    input[type="radio"]:checked, input[type="checkbox"]:checked {
      background-color: var(--primary);
      border-color: var(--primary);
    }
    label {
      display: inline-block;
      font-size: 1rem;
      color: var(--text);
      vertical-align: middle;
      cursor: pointer;
    }
    button {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 1rem;
      font-size: 1rem;
      transition: background-color 0.3s ease-in-out;
    }
    button:hover {
      background: var(--secondary);
    }
    .answer-feedback {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 8px;
    }
    .correct {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }
    .incorrect {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal {
      background: var(--background);
      color: var(--text);
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: fadeIn 0.3s ease-out;
    }
    .modal h2 {
      margin: 0 0 1rem;
    }
    .modal p {
      margin: 0.5rem 0;
    }
    .modal .score-bar {
      background: var(--accent);
      height: 20px;
      border-radius: 10px;
      overflow: hidden;
      margin: 1rem 0;
    }
    .modal .score-bar div {
      background: var(--primary);
      height: 100%;
      transition: width 0.4s ease-in-out;
    }
    .modal button {
      background: var(--secondary);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }
    .modal button:hover {
      background: var(--primary);
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${quiz.title || t.title}</h1>
    <div id="quiz"></div>
    <button onclick="checkAnswers()">${t.submit}</button>
    <button onclick="retestQuiz()">${t.retest}</button>
  </div>
  <div class="modal-overlay" id="modal-overlay">
    <div class="modal">
      <h2>${t.yourResults}</h2>
      <p id="score-text"></p>
      <div class="score-bar">
        <div id="score-bar-fill"></div>
      </div>
      <button onclick="closeModal()">Close</button>
    </div>
  </div>
</body>
</html>`;
}

function generateQuizJs(quiz: any, language: Language): string {
  const t = translations[language]?.quiz || translations.en.quiz;

  return `const questions = ${JSON.stringify(quiz.questions)};

const t = {
  yourAnswer: "${t.yourAnswer}",
  noAnswer: "${t.noAnswer}",
  correctAnswer: "${t.correctAnswer}",
  incorrectAnswer: "${t.incorrectAnswer}",
  placeholders: {
    textAnswer: "${t.placeholders.textAnswer}"
  },
  scoreText: "${t.scoreText}"
};

let shuffledQuestions = [...questions];

function shuffleQuestions() {
  shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
}

function renderQuiz() {
  shuffleQuestions();
  const quizElement = document.getElementById('quiz');
  quizElement.innerHTML = shuffledQuestions.map((question, index) => {
    const inputName = \`question-\${index}\`;
    const codeHtml = question.code ? \`<pre class="code">\${question.code}</pre>\` : '';
    let answersHtml = '';

    if (question.type === 'text') {
      answersHtml = \`
        \${codeHtml}
        <input type="text" name="\${inputName}" placeholder="\${t.placeholders.textAnswer}" />
      \`;
    } else if (question.options) {
      answersHtml = question.options.map((option, optIndex) => \`
        <div>
          <input type="\${question.type === 'multiple-choice' ? 'checkbox' : 'radio'}" 
                 name="\${inputName}" 
                 value="\${optIndex}" 
                 id="\${inputName}-\${optIndex}" />
          <label for="\${inputName}-\${optIndex}">
            \${option.text}
            \${option.code ? \`<pre class="code">\${option.code}</pre>\` : ''}
          </label>
        </div>
      \`).join('');
      answersHtml = \`\${codeHtml}\${answersHtml}\`;
    }

    return \`
      <div class="question">
        <span class="question-number">Question \${index + 1}</span>
        <h3>\${question.text}</h3>
        \${answersHtml}
        <div id="feedback-\${index}" class="answer-feedback" style="display: none;"></div>
      </div>
    \`;
  }).join('');
}

function disableInputs() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => input.disabled = true);
}

function enableInputs() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => input.disabled = false);
}

function checkAnswers() {
  let correctCount = 0;

  shuffledQuestions.forEach((question, index) => {
    const inputName = \`question-\${index}\`;
    const feedbackElement = document.getElementById(\`feedback-\${index}\`);

    let isCorrect = false;
    let userAnswer = '';

    if (question.type === 'text') {
      const input = document.querySelector(\`input[name="\${inputName}"]\`);
      userAnswer = input?.value.trim() || '';
      isCorrect = userAnswer.toLowerCase() === (question.correctAnswer?.toLowerCase() || '');
    } else if (question.options) {
      const selectedInputs = document.querySelectorAll(\`input[name="\${inputName}"]:checked\`);
      const selectedIndices = Array.from(selectedInputs).map(input => Number(input.value));

      if (question.type === 'multiple-choice') {
        isCorrect = question.options.every((option, idx) =>
          option.isCorrect === selectedIndices.includes(idx)
        );
        userAnswer = selectedIndices.map(i => question.options[i].text).join(', ');
      } else {
        const selectedInput = selectedInputs[0];
        if (selectedInput) {
          const selectedIndex = Number(selectedInput.value);
          isCorrect = question.options[selectedIndex]?.isCorrect || false;
          userAnswer = question.options[selectedIndex]?.text || '';
        }
      }
    }

    const correctAnswer = question.type === 'text'
      ? question.correctAnswer || t.noAnswer
      : question.options
          .filter(option => option.isCorrect)
          .map(option => option.text)
          .join(', ');

    feedbackElement.style.display = 'block';
    feedbackElement.className = \`answer-feedback \${isCorrect ? 'correct' : 'incorrect'}\`;
    feedbackElement.innerHTML = \`
      <p><strong>\${isCorrect ? '✓ ' + t.correctAnswer : '✗ ' + t.incorrectAnswer}</strong></p>
      <p>\${t.yourAnswer}: \${userAnswer || t.noAnswer}</p>
      \${!isCorrect ? \`<p>\${t.correctAnswer}: \${correctAnswer}</p>\` : ''}
    \`;

    if (isCorrect) correctCount++;
  });

  disableInputs();
  showResults(correctCount, shuffledQuestions.length);
}

function showResults(correct, total) {
  const overlay = document.getElementById('modal-overlay');
  const scoreText = document.getElementById('score-text');
  const scoreBarFill = document.getElementById('score-bar-fill');

  scoreText.innerText = \`\${t.scoreText} \${correct} / \${total}\`;
  scoreBarFill.style.width = \`\${(correct / total) * 100}%\`;
  overlay.style.display = 'flex';
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.style.display = 'none';
}

function retestQuiz() {
  enableInputs();
  renderQuiz();
}

// Initialize the quiz
renderQuiz();`;
}

function downloadQuiz(quiz: any, language?: Language) {
  const selectedLanguage = language || (localStorage.getItem('language') as Language) || 'en';

  const htmlBlob = new Blob([generateQuizHtml(quiz, selectedLanguage)], { type: 'text/html' });
  const htmlUrl = URL.createObjectURL(htmlBlob);
  const htmlLink = document.createElement('a');
  htmlLink.href = htmlUrl;
  htmlLink.download = `quiz-${quiz.id || 'export'}.html`;
  htmlLink.click();
  URL.revokeObjectURL(htmlUrl);

  const jsBlob = new Blob([generateQuizJs(quiz, selectedLanguage)], { type: 'text/javascript' });
  const jsUrl = URL.createObjectURL(jsBlob);
  const jsLink = document.createElement('a');
  jsLink.href = jsUrl;
  jsLink.download = 'quiz.js';
  jsLink.click();
  URL.revokeObjectURL(jsUrl);
}

export { generateQuizHtml, downloadQuiz };
