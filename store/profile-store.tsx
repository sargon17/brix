import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const PROFILE_TYPES = ["buyer", "admin"] as const;

type ProfileType = (typeof PROFILE_TYPES)[number];

interface ProfileState {
  profile: ProfileType;
  setProfile: (to: ProfileType) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: "buyer",
      setProfile: (to) => set(() => ({ profile: to })),
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
