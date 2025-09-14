export const Countries = ["USA", "Japan", "Puerto Rico", "Canada", "Cuba", "Mexico", "South Korea"] as const;
export type Country = typeof Countries[number];