import { Quiz } from '@/types/quiz';

function generateQuizHtml(quiz: Quiz): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${quiz.title}</title>
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
      padding: 0.5rem;
      border: 1px solid var(--accent);
      border-radius: 4px;
      margin-top: 0.5rem;
    }
    input[type="radio"], input[type="checkbox"] {
      margin-right: 0.5rem;
    }
    button {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
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
  </style>
</head>
<body>
  <div class="container">
    <h1>${quiz.title}</h1>
    <div id="quiz"></div>
    <button onclick="checkAnswers()">Submit Answers</button>
    <button onclick="retestQuiz()">Retest</button>
  </div>
</body>
</html>`;
}

function generateQuizJs(quiz: Quiz): string {
  const questions = JSON.stringify(quiz.questions);

  return `const questions = ${questions};
let shuffledQuestions = [...questions];

function shuffleQuestions() {
  shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
}

function renderQuiz() {
  shuffleQuestions();
  const quizElement = document.getElementById('quiz');
  quizElement.innerHTML = shuffledQuestions.map((question, index) => {
    const inputName = \`question-\${index}\`;
    let answersHtml = '';

    if (question.type === 'text' || question.type === 'code-snippet') {
      const codeHtml = question.code ? \`<pre class="code">\${question.code}</pre>\` : '';
      answersHtml = \`
        \${codeHtml}
        <input type="text" name="\${inputName}" placeholder="Type your answer here" />
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
  shuffledQuestions.forEach((question, index) => {
    const inputName = \`question-\${index}\`;
    const feedbackElement = document.getElementById(\`feedback-\${index}\`);

    let isCorrect = false;
    let userAnswer = '';

    if (question.type === 'text' || question.type === 'code-snippet') {
      const input = document.querySelector(\`input[name="\${inputName}"]\`);
      userAnswer = input.value.trim();
      isCorrect = userAnswer.toLowerCase() === question.correctAnswer?.toLowerCase();
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
          isCorrect = question.options[selectedIndex]?.isCorrect;
          userAnswer = question.options[selectedIndex]?.text;
        }
      }
    }

    feedbackElement.style.display = 'block';
    feedbackElement.className = \`answer-feedback \${isCorrect ? 'correct' : 'incorrect'}\`;
    feedbackElement.innerHTML = \`
      <p><strong>\${isCorrect ? '✓ Correct' : '✗ Incorrect'}</strong></p>
      <p>Your answer: \${userAnswer || '(No answer)'}</p>
    \`;
  });

  disableInputs();
}

function retestQuiz() {
  enableInputs();
  renderQuiz();
}

// Initialize the quiz
renderQuiz();`;
}

export function downloadQuiz(quiz: Quiz) {
  const htmlBlob = new Blob([generateQuizHtml(quiz)], { type: 'text/html' });
  const htmlUrl = URL.createObjectURL(htmlBlob);
  const htmlLink = document.createElement('a');
  htmlLink.href = htmlUrl;
  htmlLink.download = `quiz-${quiz.id}.html`;
  htmlLink.click();
  URL.revokeObjectURL(htmlUrl);

  const jsBlob = new Blob([generateQuizJs(quiz)], { type: 'text/javascript' });
  const jsUrl = URL.createObjectURL(jsBlob);
  const jsLink = document.createElement('a');
  jsLink.href = jsUrl;
  jsLink.download = 'quiz.js';
  jsLink.click();
  URL.revokeObjectURL(jsUrl);
}
