import { create } from "zustand";

export interface GoogleRegistrationData {
  idToken: string;
  email: string;
  displayName: string;
  picture?: string;
}

interface GoogleRegistrationState {
  googleRegistration: GoogleRegistrationData | null;

  setGoogleRegistration: (
    data: GoogleRegistrationData,
  ) => void;

  clearGoogleRegistration: () => void;
}

export const useGoogleRegistrationStore =
  create<GoogleRegistrationState>(
    (set) => ({
      googleRegistration: null,

      setGoogleRegistration: (
        data,
      ) =>
        set({
          googleRegistration: data,
        }),

      clearGoogleRegistration: () =>
        set({
          googleRegistration: null,
        }),
    }),
  );