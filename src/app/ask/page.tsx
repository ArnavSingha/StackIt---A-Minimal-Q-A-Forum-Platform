import { AskQuestionForm } from './_components/ask-question-form';

export default function AskPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Ask a Public Question</h1>
      </div>
      <AskQuestionForm />
    </div>
  );
}
