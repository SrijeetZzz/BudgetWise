'use client';

import * as React from 'react';

import { Input as InputPrimitive } from '@base-ui/react/input';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'size'> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      leftIcon,
      rightIcon,
      loading = false,
      invalid = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const hasLeft = Boolean(leftIcon);
    const hasRight = Boolean(rightIcon) || loading;

    return (
      <div className="relative w-full">
        {hasLeft && (
          <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}

        <InputPrimitive
          ref={ref}
          data-slot="input"
          type={type}
          aria-invalid={invalid}
          disabled={disabled || loading}
          className={cn(
            'flex h-11 w-full rounded-xl border border-input bg-background text-sm transition-all duration-200',
            'placeholder:text-muted-foreground',
            'focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            invalid &&
              'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
            hasLeft && 'pl-10',
            hasRight && 'pr-10',
            className,
          )}
          {...props}
        />

        {loading ? (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightIcon}
            </div>
          )
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };