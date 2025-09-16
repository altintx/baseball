import { AtBat } from "./at-bat";
import { Outcome } from "./inning";
import { PlayerPosition } from "./player-position";
import { TeamPlayer } from "./team-player";

export class Field {
  fielders: Record<PlayerPosition, TeamPlayer>;
  onBase: {
    "1B": TeamPlayer | null;
    "2B": TeamPlayer | null;
    "3B": TeamPlayer | null;
    "H": TeamPlayer | null;
  };
  constructor(defense: Record<PlayerPosition, TeamPlayer>) {
    this.fielders = defense;
    this.onBase = {
      "1B": null,
      "2B": null,
      "3B": null,
      "H": null,
    }
  }

  atBat(batter: TeamPlayer, pitcher: TeamPlayer): AtBat {
    this.onBase.H = batter;
    return new AtBat(batter, pitcher);
  }

  advanceRunners(batterMovesToBase: PlayerPosition, batter: TeamPlayer, inning: Outcome) {
    const forcedMovements = batterMovesToBase === "1B" ? 1 : batterMovesToBase === "2B" ? 2 : batterMovesToBase === "3B" ? 3 : 4;
    for(let i = 3; i >= 0; i--) {
      const base = i === 0 ? "H" : i === 1 ? "1B" : i === 2 ? "2B" : "3B";
      const nextBase = i + 1 === 1 ? "1B" : i + 1 === 2 ? "2B" : i + 1 === 3 ? "3B" : "H";
      if(this.onBase[base] && (i < forcedMovements || this.onBase[nextBase])) {
        if(nextBase === "H") {
          console.log(`    ${this.onBase[base]!.player.lastName} scores!`);
          this.onBase[base]!.awardExperience(10);
          this.onBase[base] = null;
          inning.runs++;
        } else {
          console.log(`    ${this.onBase[base]!.player.lastName} advances to ${nextBase}`);
          this.onBase[nextBase] = this.onBase[base];
          this.onBase[base] = null;
          this.onBase[nextBase]!.awardExperience(5);
        }
      }
    }
  }
}