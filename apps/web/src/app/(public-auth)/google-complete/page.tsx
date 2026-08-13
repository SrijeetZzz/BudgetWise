import { GoogleCompleteForm } from '@/features/auth/components/google-complete-form';

export default function GoogleCompletePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 rounded-3xl border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            Complete Your Account
          </h1>

          <p className="text-sm text-muted-foreground">
            Add your phone number and enter the
            verification code sent to your Google
            email.
          </p>
        </div>

        <GoogleCompleteForm />
      </div>
    </main>
  );
}