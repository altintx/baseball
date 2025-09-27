import { AtBat } from "./at-bat";
import { Base } from "./base";
import { Game } from "./game";
import { Outcome } from "./inning";
import { PlayerPosition } from "./player-position";
import { TeamPlayer } from "./team-player";

export class Field {
  fielders: Record<PlayerPosition, TeamPlayer>;
  onBase: Record<Base, TeamPlayer | null>;
  game: Game;

  constructor(defense: Record<PlayerPosition, TeamPlayer>, game: Game) {
    this.fielders = defense;
    this.onBase = {
      "1B": null,
      "2B": null,
      "3B": null,
      "H": null,
    }
    this.game = game;
  }

  atBat(batter: TeamPlayer, pitcher: TeamPlayer, field: Field): AtBat {
    this.onBase.H = batter;
    return new AtBat({ batter, pitcher, field, balls: 0, strikes: 0 });
  }

  runnersBase(teamPlayer: TeamPlayer): Base | null {
    for (const [base, player] of Object.entries(this.onBase) as [Base, TeamPlayer | null][]) {
      if(player === teamPlayer) return base;
    }
    return null;
  }

  runnersOnBase(): number {
    return Object.values(this.onBase).reduce((acc, player) => player ? acc + 1 : acc, 0);
  }

  // pretty sure this is wrong
  advanceRunners(batterMovesToBase: Base, batter: TeamPlayer, inning: Outcome) {
    const forcedMovements = batterMovesToBase === "1B" ? 1 : batterMovesToBase === "2B" ? 2 : batterMovesToBase === "3B" ? 3 : 4;
    for(let i = 3; i >= 0; i--) {
      const base = i === 0 ? "H" : i === 1 ? "1B" : i === 2 ? "2B" : "3B";
      const nextBase = i + 1 === 1 ? "1B" : i + 1 === 2 ? "2B" : i + 1 === 3 ? "3B" : "H";
      if(this.onBase[base] && (i < forcedMovements || this.onBase[nextBase])) {
        if(nextBase === "H") {
          this.game.logger.log("debug",`    ${this.onBase[base]!.player.lastName} scores!`);
          this.onBase[base]!.awardExperience(10, this.game);
          this.onBase[base] = null;
          inning.runs++;
        } else {
          this.game.logger.log("debug",`    ${this.onBase[base]!.player.lastName} advances to ${nextBase}`);
          this.onBase[nextBase] = this.onBase[base];
          this.onBase[base] = null;
          this.onBase[nextBase]!.awardExperience(5, this.game);
        }
      }
    }
  }
}