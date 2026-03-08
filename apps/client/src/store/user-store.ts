import { User } from "@/utils/type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
  info: User | null;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setData: (data: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      info: null,
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      setData: (data) => set({ info: data }),

      logout: () => set({ info: null }),
    }),
    {
      name: "user-storage",

      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        info: state.info,
      }),

      version: 1,

      migrate: (persistedState, version) => {
        if (version === 0) {
          return persistedState as UserStore;
        }
        return persistedState as UserStore;
      },

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
