import { Player } from "../../../entity/player";
import { PlayerAttributeBuckets, PlayerAttributePoint } from "../../../entity/player-attribute-point";
import { PlayerPositions } from "../../../entity/player-position";
import { TeamPlayer } from "../../../entity/team-player";

export const teamPlayers1: TeamPlayer[] = [];
for (let i = 0; i < 25; i++) {
  const player = Player.generate(i / 25, "USA", "male")
  const teamPlayer = new TeamPlayer({
    player,
    number: i + 1,
    position: i < 9? PlayerPositions[i]: "P",
    activeFrom: new Date("2023-04-01"),
  });
  teamPlayers1.push(teamPlayer);
  let availablePoints = 13;
  while (availablePoints > 0) {
    const value = Math.random() > 0.2 ? 1: -1;
    const type = PlayerAttributeBuckets[(PlayerAttributeBuckets.length * Math.random()) | 0];
    const attribute = new PlayerAttributePoint({ type, value });
    // Assign attribute to player
    player.proficencies.push(attribute);
    availablePoints -= value;
  }
}