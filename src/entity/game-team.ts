import { Lineup } from "./lineup";
import { Team } from "./team";
import { TeamPlayer } from "./team-player";

export class GameTeam {
  team: Team;
  lineUp: Lineup;
  relieved: TeamPlayer[] = [];
  constructor (team: Team, lineUp: Lineup) {
    this.team = team;
    this.lineUp = lineUp;
  } 
  bullPen(): TeamPlayer[] {
    return this.team.players.filter(p => p.position === "P" && p !== this.lineUp.positions["P"] && !this.relieved.includes(p));
  }
  relieve(fatigued: TeamPlayer, fresh: TeamPlayer): void {
    if(!this.bullPen().includes(fresh)) {
      throw new Error(`Cannot relieve with player ${fresh}, not in bullpen`);
    }
    this.relieved.push(fatigued);
    this.lineUp.positions[fatigued.position] = fresh;
  }
}