export const OffensiveBaseActions = ["steal", "advance", "stay"] as const;
export const OffensiveHitterActions = ["swing", "take", "bunt"] as const;
export const DefensiveActions = ["catch", "check", "tag", "force", "throw"] as const;
export type OffensiveAction = typeof OffensiveBaseActions[number] | typeof OffensiveHitterActions[number];
export type DefensiveAction = typeof DefensiveActions[number];
export type Action = OffensiveAction | DefensiveAction;
