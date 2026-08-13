export function AuthDivider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>

      <div className="relative flex justify-center">
        <span className="bg-card px-4 text-sm text-muted-foreground">
          OR
        </span>
      </div>
    </div>
  );
}