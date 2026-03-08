import { Organization } from "@/utils/type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface OrganizationStore {
  info: Organization | null;
  hasHydrated: boolean;
  setData: (data: Organization) => void;
  logout: () => void;
}

export const useOrgStore = create<OrganizationStore>()(
  persist(
    (set) => ({
      info: null,
      hasHydrated: false,

      setData: (data) => set({ info: data }),
      logout: () => set({ info: null }),
    }),
    {
      name: "org-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        info: state.info,
      }),

      version: 1,

      migrate: (persistedState, version) => {
        if (version === 0) {
          return persistedState as OrganizationStore;
        }
        return persistedState as OrganizationStore;
      },

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);
