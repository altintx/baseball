export const positions = ["C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH", "P"] as const;
export type PlayerPosition = typeof positions[number];