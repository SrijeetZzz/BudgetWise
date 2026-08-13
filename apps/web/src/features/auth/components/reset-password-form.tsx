'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/common/forms/password-input';

import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from '../schemas/reset-password.schema';

import { useResetPassword } from '../hooks/use-reset-password';

interface ResetPasswordFormProps {
  email: string;
}

export function ResetPasswordForm({
  email,
}: ResetPasswordFormProps) {
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),

    defaultValues: {
      email,
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (
    values: ResetPasswordSchema,
  ) => {
    await resetPassword.mutateAsync({
      email: values.email,
      otp: values.otp,
      newPassword: values.newPassword,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Email */}

      <div className="space-y-2">
        <Input
          {...register('email')}
          type="email"
          placeholder="Email"
          disabled
        />

        {errors.email && (
          <p className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* OTP */}

      <div className="space-y-2">
        <Input
          {...register('otp')}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          inputMode="numeric"
          invalid={!!errors.otp}
        />

        {errors.otp && (
          <p className="text-sm text-destructive">
            {errors.otp.message}
          </p>
        )}
      </div>

      {/* New Password */}

      <div className="space-y-2">
        <PasswordInput
          {...register('newPassword')}
          placeholder="New Password"
          invalid={!!errors.newPassword}
        />

        {errors.newPassword && (
          <p className="text-sm text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}

      <div className="space-y-2">
        <PasswordInput
          {...register('confirmPassword')}
          placeholder="Confirm New Password"
          invalid={!!errors.confirmPassword}
        />

        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        fullWidth
        loading={resetPassword.isPending}
      >
        Reset Password
      </Button>
    </form>
  );
}