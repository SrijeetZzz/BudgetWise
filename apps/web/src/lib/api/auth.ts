// src/lib/api/auth.ts

let accessToken: string | null = null;

export const authToken = {
  get: (): string | null => accessToken,

  set: (token: string) => {
    accessToken = token;
  },

  clear: () => {
    accessToken = null;
  },

  isAuthenticated: () => {
    return accessToken !== null;
  },
};