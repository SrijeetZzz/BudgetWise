'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';



import { useGoogleComplete } from '../hooks/use-google-complete';
import { googleCompleteSchema, GoogleCompleteSchema } from '../schemas/google-complete.schema';
import { useAuthStore } from '@/store/auth.store';

export function GoogleCompleteForm() {
  const googleComplete = useGoogleComplete();

  const pendingGoogleRegistration =
    useAuthStore(
      (state) => state.pendingGoogleRegistration,
    );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoogleCompleteSchema>({
    resolver: zodResolver(
      googleCompleteSchema,
    ),

    defaultValues: {
      phone: '',
      otp: '',
    },
  });

  const onSubmit = async (
    values: GoogleCompleteSchema,
  ) => {
    await googleComplete.mutateAsync(values);
  };

  if (!pendingGoogleRegistration) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="font-medium">
          {pendingGoogleRegistration.displayName}
        </p>

        <p className="text-sm text-muted-foreground">
          {pendingGoogleRegistration.email}
        </p>
      </div>

      <div className="space-y-2">
        <Input
          {...register('phone')}
          type="tel"
          placeholder="Phone Number"
          maxLength={10}
          inputMode="numeric"
          invalid={!!errors.phone}
        />

        {errors.phone && (
          <p className="text-sm text-destructive">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          {...register('otp')}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          inputMode="numeric"
          className="text-center tracking-[0.5em]"
          invalid={!!errors.otp}
        />

        {errors.otp && (
          <p className="text-sm text-destructive">
            {errors.otp.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        fullWidth
        loading={googleComplete.isPending}
      >
        Complete Registration
      </Button>
    </form>
  );
}