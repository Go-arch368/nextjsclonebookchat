import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "admin" | "manager" | "agent";

export interface User {
  id: number;
  role: Role;
  email: string;
  name: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-storage", 
      partialize: (state) => ({ user: state.user }), 
    }
  )
);
