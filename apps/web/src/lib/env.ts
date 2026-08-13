type Environment = 'development' | 'production' | 'test';

export const env = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'BudgetWise',

  APP_ENV: (process.env.NODE_ENV ??
    'development') as Environment,

  APP_URL:
    process.env.NEXT_PUBLIC_APP_URL ??
    'http://localhost:3000',

  API_URL:
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:5000/api/v1',

  GOOGLE_CLIENT_ID:
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
} as const;