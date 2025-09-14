export const Genders = ["male", "female"] as const;
export type Gender = typeof Genders[number];
