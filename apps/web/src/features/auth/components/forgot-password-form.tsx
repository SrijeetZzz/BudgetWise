'use client';

import Link from 'next/link';

import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from '../schemas/forgot-password.schema';

import { useForgotPassword } from '../hooks/use-forgot-password';

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),

    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (
    values: ForgotPasswordSchema,
  ) => {
    await forgotPassword.mutateAsync(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Input
          {...register('email')}
          type="email"
          placeholder="Email"
          leftIcon={<Mail className="size-4" />}
          invalid={!!errors.email}
        />

        {errors.email && (
          <p className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        fullWidth
        loading={forgotPassword.isPending}
      >
        Send OTP
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-primary hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </form>
  );
}