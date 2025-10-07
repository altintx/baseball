import { TeamPlayer } from "../entity/team-player";

export function playerStatsToText(tp: TeamPlayer): string {
  const a = tp.player.playerAttributes();
  return `- #${tp.number} ${tp.player.lastName}, ${tp.player.firstName} (${tp.position}, ${tp.player.battingSide('brief')}) STR ${a.Strength} INT ${a.Intelligence} DEX ${a.Dexterity} CHA ${a.Charisma} CON ${a.Constitution} WIS ${a.Wisdom}`;
}