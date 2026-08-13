import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

interface ResetPasswordPageProps {
  searchParams: Promise<{
    email?: string;
  }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;

  const email = params.email;

  if (!email) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center">
          <h1 className="text-xl font-semibold">
            Invalid reset request
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Please start the password reset process again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 rounded-3xl border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            Reset Password
          </h1>

          <p className="text-muted-foreground">
            Enter the OTP you received and choose a
            new password.
          </p>
        </div>

        <ResetPasswordForm email={email} />
      </div>
    </main>
  );
}