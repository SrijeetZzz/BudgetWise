import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 rounded-3xl border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            Forgot Password?
          </h1>

          <p className="text-muted-foreground">
            Enter your registered email and we'll
            send you an OTP.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </main>
  );
}