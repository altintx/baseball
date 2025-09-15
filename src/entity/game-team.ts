import { Lineup } from "./lineup";
import { Team } from "./team";

export class GameTeam {
  team: Team;
  lineUp: Lineup;
  constructor (team: Team, lineUp: Lineup) {
    this.team = team;
    this.lineUp = lineUp;
  } 
}