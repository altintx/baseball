import { PlayerPosition, PlayerPositions } from "./player-position";
import { Team } from "./team";
import { TeamPlayer } from "./team-player";

export class Lineup {
  inGame: boolean = false;
  positions: Record<PlayerPosition, TeamPlayer>;
  battingOrder: [
    PlayerPosition, 
    PlayerPosition, 
    PlayerPosition, 
    PlayerPosition, 
    PlayerPosition, 
    PlayerPosition, 
    PlayerPosition, 
    PlayerPosition, 
    PlayerPosition
  ];

  constructor(team: Team, startingPitcher: TeamPlayer, useDh: boolean = true) {
    this.positions = PlayerPositions.reduce((acc, position) => {
      const playerForPosition = team.players.find(tp => tp.position === position);
      if(position === "DH" && !playerForPosition) {
        const pitcher = team.players.find(tp => tp === startingPitcher);
      } else if (!playerForPosition) {
        throw new Error(`No player found for position ${position} in team ${team.name}`);
      }
      return {
        ...acc,
        [position]: playerForPosition,
      }
    }, {} as Record<PlayerPosition, TeamPlayer>);
    this.positions["P"] = startingPitcher;
    this.battingOrder = ["1B", "2B", "3B", "SS", "LF", "CF", "RF", useDh ? "DH" : "P", "C"];
  }
}