import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  access: string;
  isAuth: boolean;
};

type Actions = {
  setToken: (access: string) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<State & Actions>(
    (set) => ({
      access: "",
      isAuth: false,
      setToken: (access: string) =>
        set(() => ({
          access,
          isAuth: !!access,
        })),
      logout: () => set(() => ({ access: "", isAuth: false })),
    }),
    {
      name: "auth",
    }
  )
);
