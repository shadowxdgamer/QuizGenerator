export const translations = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      download: 'Download',
      preview: 'Preview',
    },
    quiz: {
      title: 'Quiz Generator',
      addQuestion: 'Add Question',
      editQuestion: 'Edit Question',
      randomize: 'Randomize Questions',
      questionTypes: {
        text: 'Text Answer',
        'multiple-choice': 'Multiple Choice',
        'single-choice': 'Single Choice',
        'code-snippet': 'Code Snippet',
      },
      placeholders: {
        questionText: 'Enter your question here',
        answerText: 'Enter the correct answer',
        optionText: 'Enter option text',
        optionalCode: 'Optional: Enter a code snippet here', // Added this key
      },
      options: 'Options',
    },
  },
  fr: {
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      edit: 'Modifier',
      delete: 'Supprimer',
      add: 'Ajouter',
      download: 'Télécharger',
      preview: 'Aperçu',
    },
    quiz: {
      title: 'Générateur de Quiz',
      addQuestion: 'Ajouter une Question',
      editQuestion: 'Modifier la Question',
      randomize: 'Questions Aléatoires',
      questionTypes: {
        text: 'Réponse Texte',
        'multiple-choice': 'Choix Multiple',
        'single-choice': 'Choix Unique',
        'code-snippet': 'Extrait de Code',
      },
      placeholders: {
        questionText: 'Entrez votre question ici',
        answerText: 'Entrez la bonne réponse',
        optionText: 'Entrez le texte de l\'option',
        optionalCode: 'Optionnel : Entrez un extrait de code ici', // Added this key
      },
      options: 'Options',
    },
  },
};

export type Language = 'en' | 'fr';
