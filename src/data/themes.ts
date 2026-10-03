// The hub can be skinned as any of Sebastian's hobbies; the rooms behind it stay the same.
export const themes = [
  { id: "soccer", label: "Soccer" },
  { id: "snow", label: "Snowboarding" },
  { id: "game", label: "Gaming" },
] as const;

export type Theme = (typeof themes)[number]["id"];
