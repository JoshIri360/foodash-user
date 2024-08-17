import { create } from "zustand";

interface OnboardingState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  university: string;
  address: string;
  phoneNumber: string;

  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setUniversity: (university: string) => void;
  setAddress: (address: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  university: "",
  address: "",
  phoneNumber: "",

  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setUniversity: (university) => set({ university }),
  setAddress: (address) => set({ address }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  resetOnboarding: () =>
    set({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      university: "",
      address: "",
      phoneNumber: "",
    }),
}));
