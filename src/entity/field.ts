import { AtBat } from "./at-bat";
import { Base } from "./base";
import { Game } from "./game";
import { Inning, Outcome } from "./inning";
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

  runnersBase(teamPlayer: TeamPlayer): Base | null {
    for (const [base, player] of Object.entries(this.onBase) as [Base, TeamPlayer | null][]) {
      if(player === teamPlayer) return base;
    }
    return null;
  }

  runnersOnBase(): number {
    return Object.values(this.onBase).reduce((acc, player) => player ? acc + 1 : acc, 0);
  }

  advanceRunners(batterMovesToBase: Base, batter: TeamPlayer, inning: Outcome): void {
    const nextBase: Record<Base, Base> = {
      "1B": "2B",
      "2B": "3B",
      "3B": "H",
      "H": "H",
    };
    const atBat = inning.atBats[inning.atBats.length - 1];
    if(!atBat) throw new Error("No atBat found in inning when trying to advance runners");
    const baseValue: Record<Base, number> = { "1B": 1, "2B": 2, "3B": 3, "H": 4 };

    const push = (base: Base) => {
      const runner = this.onBase[base];
      if (!runner) return;

      const dest = nextBase[base];
      this.onBase[base] = null;

      if (dest === "H") {
        atBat.rbi++;
        return;
      }

      if (this.onBase[dest]) push(dest);

      this.onBase[dest] = runner;
    };

    const steps = baseValue[batterMovesToBase];

    // cascade forces one step at a time
    for (let i = 0; i < steps; i++) {
      const dest = (["1B", "2B", "3B", "H"] as Base[])[i];
      if (dest !== "H") push(dest);
    }

    if (batterMovesToBase === "H") {
      atBat.rbi++;
    } else {
      this.onBase[batterMovesToBase] = batter;
    }
    inning.runs += atBat.rbi;
    this.onBase.H = null;
  }
}