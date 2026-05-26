export function SuggestedQuestions({ questions, onSelect }: { questions: string[]; onSelect: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-savanna-green hover:text-savanna-green"
        >
          {question}
        </button>
      ))}
    </div>
  );
}