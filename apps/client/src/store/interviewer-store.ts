import { Interviewer } from "@/utils/type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type InterviewerStore = {
  info: Interviewer | null;
  hasHydrated: boolean;
  setData: (data: Interviewer) => void;
  logout: () => void;
};

export const useInterviewer = create<InterviewerStore>()(
  persist(
    (set) => ({
      info: null,
      hasHydrated: false,
      setData: (data) => set({ info: data }),
      logout: () => set({ info: null }),
    }),
    {
      name: "interview-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        info: state.info,
      }),

      version: 1,

      migrate: (persistedState, version): InterviewerStore => {
        if (version === 0) {
          return persistedState as InterviewerStore;
        }
        return persistedState as InterviewerStore;
      },

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);
