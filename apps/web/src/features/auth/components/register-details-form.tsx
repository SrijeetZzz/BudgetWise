'use client';

import Link from 'next/link';
import { Mail, Phone, User, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/common/forms/password-input';

import { getDeviceId } from '@/lib/device';
import {
  registerSchema,
  type RegisterSchema,
} from '../schemas/register.schema';
import { useSendOtp } from '../hooks/use-send-otp';
import { GoogleLoginButton } from '@/features/auth/components/google-login-button';

interface RegisterDetailsFormProps {
  onOtpSent: (data: RegisterSchema) => void;
}

export function RegisterDetailsForm({
  onOtpSent,
}: RegisterDetailsFormProps) {
  const sendOtp = useSendOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      deviceId: getDeviceId(),
    },
  });

  const onSubmit = async (values: RegisterSchema) => {
    await sendOtp.mutateAsync({
      email: values.email,
      purpose: 'REGISTER',
    });

    onOtpSent(values);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        {/* Header Section */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Create an account
          </h1>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            Enter your details below to get started
          </p>
        </div>

        {/* Primary Social Auth Option */}
        <GoogleLoginButton />

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <span className="relative bg-card px-2 text-xs uppercase tracking-wider text-muted-foreground">
            Or register with email
          </span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Display Name */}
          <div className="space-y-1.5">
            <Label htmlFor="displayName" className="text-xs font-medium text-foreground sm:text-sm">
              Full Name
            </Label>
            <Input
              id="displayName"
              placeholder="John Doe"
              leftIcon={<User className="size-4 text-muted-foreground" />}
              invalid={!!errors.displayName}
              className="h-11 text-sm sm:h-10"
              {...register('displayName')}
            />
            {errors.displayName && (
              <p className="text-xs font-medium text-destructive">
                {errors.displayName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-foreground sm:text-sm">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
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

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-medium text-foreground sm:text-sm">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone className="size-4 text-muted-foreground" />}
              invalid={!!errors.phone}
              className="h-11 text-sm sm:h-10"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-xs font-medium text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium text-foreground sm:text-sm">
              Password
            </Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground sm:text-sm">
              Confirm Password
            </Label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="••••••••"
              leftIcon={<Lock className="size-4 text-muted-foreground" />}
              invalid={!!errors.confirmPassword}
              className="h-11 text-sm sm:h-10"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            loading={sendOtp.isPending}
            className="mt-2 h-11 text-sm font-semibold tracking-wide sm:h-10"
          >
            {sendOtp.isPending ? 'Sending code...' : 'Continue with Email'}
          </Button>

          {/* Existing account link */}
          <p className="pt-2 text-center text-xs text-muted-foreground sm:text-sm">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}