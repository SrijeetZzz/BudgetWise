'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, KeyRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  registerOtpSchema,
  type RegisterOtpSchema,
} from '../schemas/register-otp.schema';

import { useRegister } from '../hooks/use-register';

import type { RegisterSchema } from '../schemas/register.schema';

interface RegisterOtpFormProps {
  registrationData: RegisterSchema;
  onBack: () => void;
}

export function RegisterOtpForm({
  registrationData,
  onBack,
}: RegisterOtpFormProps) {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterOtpSchema>({
    resolver: zodResolver(registerOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async (values: RegisterOtpSchema) => {
    await registerMutation.mutateAsync({
      displayName: registrationData.displayName,
      email: registrationData.email,
      phone: registrationData.phone,
      password: registrationData.password,
      otp: values.otp,
      deviceId: registrationData.deviceId,
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        {/* Header Section */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <KeyRound className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Verify your email
          </h1>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            Enter the 6-digit code sent to{' '}
            <span className="font-medium text-foreground break-all">
              {registrationData.email}
            </span>
          </p>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Input
              {...register('otp')}
              autoFocus
              placeholder="••••••"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              invalid={!!errors.otp}
              className="h-12 text-center text-xl font-mono tracking-[0.5em] sm:h-11 sm:text-2xl placeholder:tracking-normal placeholder:font-sans"
            />

            {errors.otp && (
              <p className="text-center text-xs font-medium text-destructive">
                {errors.otp.message}
              </p>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <Button
              type="submit"
              fullWidth
              loading={registerMutation.isPending}
              className="h-11 text-sm font-semibold tracking-wide transition-all active:scale-[0.98] sm:h-10"
            >
              Verify & Create Account
            </Button>

            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={onBack}
              disabled={registerMutation.isPending}
              className="h-11 text-xs text-muted-foreground hover:text-foreground sm:h-10 sm:text-sm"
            >
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}