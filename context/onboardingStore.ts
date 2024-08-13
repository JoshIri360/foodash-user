import { create } from "zustand";

interface OnboardingState {
  step: number;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  university: string;
  address: string;
  phoneNumber: string;

  setStep: (step: number) => void;
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
  step: 1,
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  university: "",
  address: "",
  phoneNumber: "",

  setStep: (step) => set({ step }),
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setUniversity: (university) => set({ university }),
  setAddress: (address) => set({ address }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  resetOnboarding: () =>
    set({
      step: 1,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      university: "",
      address: "",
      phoneNumber: "",
    }),
}));
