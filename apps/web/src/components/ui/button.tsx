'use client';

import type { ReactNode } from 'react';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'group/button',
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'rounded-xl',
    'border',
    'border-transparent',
    'font-medium',
    'transition-all',
    'duration-200',
    'select-none',
    'outline-none',
    'whitespace-nowrap',
    'shrink-0',
    'cursor-pointer',

    'focus-visible:border-ring',
    'focus-visible:ring-4',
    'focus-visible:ring-ring/30',

    'disabled:pointer-events-none',
    'disabled:opacity-50',

    'active:scale-[0.98]',

    '[&_svg]:shrink-0',
    '[&_svg]:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90',

        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',

        outline:
          'border-border bg-background text-foreground hover:bg-muted',

        ghost:
          'text-foreground hover:bg-muted',

        destructive:
          'bg-destructive text-white hover:bg-destructive/90',

        success:
          'bg-success text-white hover:opacity-90',

        income:
          'bg-income text-white hover:opacity-90',

        expense:
          'bg-expense text-white hover:opacity-90',

        warning:
          'bg-warning text-black hover:opacity-90',

        link:
          'text-primary underline-offset-4 hover:underline',
      },

      size: {
        sm: 'h-9 px-3 text-sm',

        default: 'h-11 px-4 text-sm',

        lg: 'h-12 px-6 text-base',

        icon: 'size-11',

        'icon-sm': 'size-9',

        'icon-lg': 'size-12',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  className,
  variant,
  size,

  loading = false,

  leftIcon,
  rightIcon,

  fullWidth = false,

  disabled,

  children,

  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      aria-busy={loading}
      aria-disabled={disabled || loading}
      data-loading={loading}
      disabled={disabled || loading}
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          leftIcon
        )}

        <span>{children}</span>

        {!loading && rightIcon}
      </span>
    </ButtonPrimitive>
  );
}

Button.displayName = 'Button';

export { buttonVariants };