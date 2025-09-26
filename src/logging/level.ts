export const LogLevels = ["quiet", "normal", "verbose", "debug"] as const;
export type LogLevel = typeof LogLevels[number];
