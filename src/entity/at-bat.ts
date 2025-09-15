import { Pitch } from "./pitch";
import { TeamPlayer } from "./team-player";

type AtBatOutcome = "Hit" | "Walk" | "Out" | "Error";

export class AtBat {
  batter: TeamPlayer;
  pitcher: TeamPlayer
  outcome: AtBatOutcome | null;
  pitches: Pitch[];

  balls: number;
  strikes: number;

  constructor(batter: TeamPlayer, pitcher: TeamPlayer, balls?: number, strikes?: number) {
    this.batter = batter;
    this.pitcher = pitcher;
    this.outcome = null;
    this.pitches = [];
    this.balls = balls ?? 0;
    this.strikes = strikes ?? 0;
  }

  simulate(): AtBat {
    const atBat = this;
    atBat.strikes++;
    if(atBat.strikes >= 3) {
      atBat.outcome = "Out";
    }
    return atBat;
  }
}