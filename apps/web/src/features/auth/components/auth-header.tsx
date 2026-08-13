import Image from 'next/image';

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({
  title,
  description,
}: AuthHeaderProps) {
  return (
    <div className="space-y-5 text-center">
      {/* Replace with your logo later */}
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow">
          B
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>

        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}