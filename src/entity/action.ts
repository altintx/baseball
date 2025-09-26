export const OffensiveActions = ["swing", "take", "bunt", "steal", "advance", "stay"] as const;
export const DefensiveActions = ["catch", "check", "tag", "force", "throw"] as const;
export type OffensiveAction = typeof OffensiveActions[number];
export type DefensiveAction = typeof DefensiveActions[number];
export type Action = OffensiveAction | DefensiveAction;
