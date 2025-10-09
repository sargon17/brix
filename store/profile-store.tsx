import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const PROFILE_TYPES = ["buyer", "admin"] as const;

type ProfileType = (typeof PROFILE_TYPES)[number];

interface ProfileState {
  profile: ProfileType;
  setProfile: (to: ProfileType) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: "buyer",
      setProfile: (to) => set(() => ({ profile: to })),
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
