

'use client';

import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { PasswordInput } from '@/components/common/forms/password-input';

import { getDeviceId } from '@/lib/device';
import { useLogin } from '@/features/auth/hooks/use-login';
import { loginSchema, LoginSchema } from '@/features/auth/schemas/login.schema';
import { GoogleLoginButton } from '@/features/auth/components/google-login-button';



export default function LoginForm() {
  const login = useLogin();
 

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
    await login.mutateAsync(values);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        {/* Header Section */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            Please enter your credentials to access your account
          </p>
        </div>

        {/* Primary Social Auth Action */}
        <GoogleLoginButton />

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <span className="relative bg-card px-2 text-xs uppercase tracking-wider text-muted-foreground">
            Or continue with email
          </span>
        </div>

        {/* Password Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-foreground sm:text-sm">
              Email Address
            </Label>

            <Input
              id="email"
              autoFocus
              autoComplete="email"
              placeholder="name@company.com"
              leftIcon={<Mail className="size-4 text-muted-foreground" />}
              invalid={!!errors.email}
              className="h-11 text-sm sm:h-10"
              {...register('email')}
            />

            {errors.email && (
              <p className="text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium text-foreground sm:text-sm">
              Password
            </Label>

            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              leftIcon={<Lock className="size-4 text-muted-foreground" />}
              invalid={!!errors.password}
              className="h-11 text-sm sm:h-10"
              {...register('password')}
            />

            {errors.password && (
              <p className="text-xs font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" className="size-4 rounded" />
              <Label
                htmlFor="remember"
                className="cursor-pointer text-xs font-normal text-muted-foreground select-none sm:text-sm"
              >
                Remember me
              </Label>
            </div>

            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline sm:text-sm"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            loading={login.isPending}
            className="mt-2 h-11 text-sm font-semibold tracking-wide sm:h-10"
          >
            {login.isPending ? 'Logging in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}