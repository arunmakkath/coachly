'use client';

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const SUGGESTED_QUESTIONS = [
  "What coaching techniques do you recommend?",
  "How can I improve my daily routine?",
  "Tell me about your coaching philosophy",
  "What are the first steps to personal growth?",
];

export default function SuggestedQuestions({ onQuestionClick }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-neutral-600 font-medium">Suggested questions:</p>
      <div className="grid grid-cols-1 gap-2">
        {SUGGESTED_QUESTIONS.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="text-left text-sm px-3 py-2 rounded-md bg-white border border-neutral-200 hover:bg-neutral-50 hover:border-primary transition-colors"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
