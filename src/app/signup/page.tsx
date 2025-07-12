import { SignupForm } from './_components/signup-form';

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-headline font-bold text-center mb-6">Create an account</h1>
        <SignupForm />
      </div>
    </div>
  );
}
