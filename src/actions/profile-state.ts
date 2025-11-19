import type { Tables } from "@/lib/database.types";

export type UpdateProfileActionState = {
  error?: string;
  success?: string;
  profile?: Tables["profiles"] | null;
};

export const updateProfileInitialState: UpdateProfileActionState = {
  error: "",
  success: "",
  profile: null,
};
