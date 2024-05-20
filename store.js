import { create } from "zustand";

export const useStore = create((set) => ({
  count: 1,
  setCount: (newVal) => set((state) => ({ count: newVal })),
}));
export const useAuth = create((set) => ({
  user: null,
  setUser: (newVal) => set((state) => ({ user: newVal })),
}));
