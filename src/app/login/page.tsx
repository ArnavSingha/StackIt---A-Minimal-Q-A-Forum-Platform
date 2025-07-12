import { LoginForm } from './_components/login-form';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-headline font-bold text-center mb-6">Log in to CommuniQ</h1>
        <LoginForm />
      </div>
    </div>
  );
}
