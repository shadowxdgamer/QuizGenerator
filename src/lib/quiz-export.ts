import { Quiz, Question } from '@/types/quiz';

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
      line-height: 1.5;
      margin: 0;
      padding: 2rem;
    }
    .container { max-width: 800px; margin: 0 auto; }
    .question { 
      background: rgba(255,255,255,0.1);
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
    .code {
      background: rgba(0,0,0,0.1);
      padding: 1rem;
      border-radius: 0.25rem;
      font-family: monospace;
      white-space: pre-wrap;
    }
    button {
      background: var(--primary);
      color: white;
      border: 0;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
    }
    button:hover { background: var(--secondary); }
    .result { margin-top: 1rem; }
    .correct { color: #22c55e; }
    .incorrect { color: #ef4444; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${quiz.title}</h1>
    <div id="quiz"></div>
    <button onclick="checkAnswers()">Submit Answers</button>
    <div id="results"></div>
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
  renderQuiz();
}

function renderQuiz() {
  const quizElement = document.getElementById('quiz');
  quizElement.innerHTML = shuffledQuestions.map((question, index) => {
    const inputName = \`question-\${index}\`;
    let answersHtml = '';

    if (question.type === 'text') {
      answersHtml = \`<input type="text" name="\${inputName}" />\`;
    } else if (question.type === 'code-snippet') {
      const codeHtml = question.code ? \`<pre class="code">\${question.code}</pre>\` : '';
      if (question.options) {
        answersHtml = question.options.map((option, optIndex) => \`
          <div>
            <input type="\${question.type === 'multiple-choice' ? 'checkbox' : 'radio'}" 
                   name="\${inputName}" 
                   value="\${optIndex}" 
                   id="\${inputName}-\${optIndex}" />
            <label for="\${inputName}-\${optIndex}">\${option.text}</label>
          </div>
        \`).join('');
      } else {
        answersHtml = \`<input type="text" name="\${inputName}" />\`;
      }
      return \`
        <div class="question">
          <h3>\${question.text}</h3>
          \${codeHtml}
          \${answersHtml}
        </div>
      \`;
    } else {
      answersHtml = question.options.map((option, optIndex) => \`
        <div>
          <input type="\${question.type === 'multiple-choice' ? 'checkbox' : 'radio'}" 
                 name="\${inputName}" 
                 value="\${optIndex}" 
                 id="\${inputName}-\${optIndex}" />
          <label for="\${inputName}-\${optIndex}">\${option.text}</label>
        </div>
      \`).join('');
    }

    return \`
      <div class="question">
        <h3>\${question.text}</h3>
        \${answersHtml}
      </div>
    \`;
  }).join('');
}

function checkAnswers() {
  const results = shuffledQuestions.map((question, index) => {
    const inputName = \`question-\${index}\`;
    let isCorrect = false;
    let userAnswer = '';

    if (question.type === 'text') {
      const input = document.querySelector(\`input[name="\${inputName}"]\`);
      userAnswer = input.value.trim().toLowerCase();
      isCorrect = userAnswer === question.correctAnswer?.toLowerCase();
    } else if (question.options) {
      if (question.type === 'multiple-choice') {
        const selectedInputs = document.querySelectorAll(\`input[name="\${inputName}"]:checked\`);
        const selectedIndices = Array.from(selectedInputs).map(input => Number(input.value));
        isCorrect = question.options.every((option, index) => 
          option.isCorrect === selectedIndices.includes(index)
        );
        userAnswer = selectedIndices.map(i => question.options[i].text).join(', ');
      } else {
        const selectedInput = document.querySelector(\`input[name="\${inputName}"]:checked\`);
        if (selectedInput) {
          const selectedIndex = Number(selectedInput.value);
          isCorrect = question.options[selectedIndex].isCorrect;
          userAnswer = question.options[selectedIndex].text;
        }
      }
    }

    return { question, userAnswer, isCorrect };
  });

  const resultsElement = document.getElementById('results');
  const score = results.filter(r => r.isCorrect).length;
  
  resultsElement.innerHTML = \`
    <h2>Results: \${score}/\${results.length}</h2>
    \${results.map(({ question, userAnswer, isCorrect }) => \`
      <div class="result \${isCorrect ? 'correct' : 'incorrect'}">
        <p><strong>\${question.text}</strong></p>
        <p>Your answer: \${userAnswer || '(no answer)'}</p>
        <p>\${isCorrect ? '✓ Correct' : '✗ Incorrect'}</p>
      </div>
    \`).join('')}
  \`;
}

// Initialize the quiz
renderQuiz();`;
}

export function downloadQuiz(quiz: Quiz) {
  // Create HTML file
  const htmlBlob = new Blob([generateQuizHtml(quiz)], { type: 'text/html' });
  const htmlUrl = URL.createObjectURL(htmlBlob);
  const htmlLink = document.createElement('a');
  htmlLink.href = htmlUrl;
  htmlLink.download = `quiz-${quiz.id}.html`;
  htmlLink.click();
  URL.revokeObjectURL(htmlUrl);

  // Create JS file
  const jsBlob = new Blob([generateQuizJs(quiz)], { type: 'text/javascript' });
  const jsUrl = URL.createObjectURL(jsBlob);
  const jsLink = document.createElement('a');
  jsLink.href = jsUrl;
  jsLink.download = 'quiz.js';
  jsLink.click();
  URL.revokeObjectURL(jsUrl);
}