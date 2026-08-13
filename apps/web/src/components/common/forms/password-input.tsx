'use client';

import { useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import { Input } from '@/components/ui/input';

interface PasswordInputProps
  extends React.ComponentProps<typeof Input> {}

export function PasswordInput({
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <Input
      {...props}
      type={showPassword ? 'text' : 'password'}
      rightIcon={
        <button
          type="button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          className="flex items-center"
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      }
    />
  );
}