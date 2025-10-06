export const LogLevels = ["none", "quiet", "normal", "verbose", "debug"] as const;
export type LogLevel = typeof LogLevels[number];
