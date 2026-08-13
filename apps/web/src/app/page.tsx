import { env } from '@/lib/env';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1>{env.APP_NAME}</h1>
    </main>
  );
}