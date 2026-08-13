'use client';

import Link from 'next/link';

import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { getDeviceId } from '@/lib/device';



import {
  loginSchema,
  type LoginSchema,
} from '../schemas/login.schema';
import { useLogin } from '../hooks/use-login';
import { PasswordInput } from '@/components/common/forms/password-input';
import { useRouter } from 'next/navigation';



export function LoginForm() {
  const login = useLogin();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      deviceId: getDeviceId(),
    },
  });

  const onSubmit = async (values: LoginSchema) => {
  try {
    await login.mutateAsync(values);

    router.push('/dashboard');
  } catch {
    // Error toast will be handled by the mutation
  }
};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Input
          {...register('email')}
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

      <div className="space-y-2">
        <PasswordInput
          {...register('password')}
          placeholder="Password"
          invalid={!!errors.password}
        />

        {errors.password && (
          <p className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        fullWidth
        loading={login.isPending}
      >
        Login
      </Button>
    </form>
  );
}
