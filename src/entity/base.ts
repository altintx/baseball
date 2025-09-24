export const Base = ["1B", "2B", "3B", "H"] as const;
export type Base = typeof Base[number];