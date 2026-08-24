import { create } from "zustand";

interface RegistrationData {
  deviceId: string;
  displayName: string;
  email: string;
  phone: string;
  password: string;
}

interface RegistrationStore {
  registration: RegistrationData | null;

  setRegistration: (
    data: RegistrationData,
  ) => void;

  clearRegistration: () => void;
}

export const useRegistrationStore =
  create<RegistrationStore>((set) => ({
    registration: null,

    setRegistration: (data) =>
      set({
        registration: data,
      }),

    clearRegistration: () =>
      set({
        registration: null,
      }),
  }));