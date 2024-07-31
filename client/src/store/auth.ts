import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  access: string;
  isAuth: boolean;
  _id: string;
};

type Actions = {
  setToken: (access: string, _id: string) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<State & Actions>(
    (set) => ({
      access: "",
      _id: "",
      isAuth: false,
      setToken: (access: string, _id: string) =>
        set(() => ({
          access,
          _id,
          isAuth: !!access,
        })),
      logout: () => set(() => ({ access: "", _id: "", isAuth: false })),
    }),
    {
      name: "auth",
    }
  )
);
