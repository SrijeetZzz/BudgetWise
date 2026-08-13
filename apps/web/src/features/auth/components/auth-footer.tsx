import Link from 'next/link';

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export function AuthFooter({
  text,
  linkText,
  href,
}: AuthFooterProps) {
  return (
    <div className="text-center text-sm text-muted-foreground">
      {text}{' '}
      <Link
        href={href}
        className="font-semibold text-primary hover:underline"
      >
        {linkText}
      </Link>
    </div>
  );
}