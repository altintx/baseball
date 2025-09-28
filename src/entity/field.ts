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

  atBat(batter: TeamPlayer, pitcher: TeamPlayer, inning: Inning): AtBat {
    this.onBase.H = batter;
    const atBat = new AtBat({ batter, pitcher, field: this, balls: 0, strikes: 0 });
    inning.offensive().atBats.push(atBat);
    return atBat;
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

  advanceRunners(batterMovesToBase: Base, batter: TeamPlayer, inning: Outcome) {
    // if a triple, everyone base 1, 2 or 3 scores, and batter goes to third
    // if a double, and somebody in 1st, 2nd and 3rd, 3rd scores, 2nd goes to 3rd, 1st goes to 2nd, batter to 2nd
    // if a double, and somebody on 2nd AND 3rd, 3rd scores, 2nd moves to third, batter to 2nd
    // if a double, and somebody on 1st and 2nd, 2nd goes to 3rd, 1st goes to 2nd, batter to 2nd
    // if a double, and somebody on 2nd, 2nd goes to 3rd, batter to 2nd
    // if a double, and somebody on 1st, 1st goes to 3rd, batter to 2nd
    // if a double, nobody on, batter to 2nd
    // if a single, and somebody on 3rd, 3rd scores, batter to 1st
    const batterMovements = batterMovesToBase === "1B" ? 1 : batterMovesToBase === "2B" ? 2 : batterMovesToBase === "3B" ? 3 : 4;
    console.log(`batter movements: ${batterMovements} for hit to ${batterMovesToBase}`);
    const firstBaseMovements = Math.max(0, Math.min(batterMovements, 3));
    const secondBaseMovements = Math.max(0, Math.min(firstBaseMovements - 1, 2));
    const thirdBaseMovements = Math.max(0, Math.min(secondBaseMovements - 1, 1));
    let rbi = 0;
    const atBat = inning.atBats[inning.atBats.length - 1];
    if(!atBat) throw new Error("No atBat found for this inning");
    if(this.onBase["3B"] && thirdBaseMovements > 0) {
      this.onBase["3B"] = null;
      rbi++;
      console.log("awarding an rbi from runner on 3B")
      this.game.logger.log("normal", `    ${atBat.batter.player.firstName} ${atBat.batter.player.lastName} drove in a run!`);
    }
    if(this.onBase["2B"] && secondBaseMovements === 2) {
      this.onBase["2B"] = null;
      rbi++;
      console.log("awarding an rbi from runner on 2B")
      this.game.logger.log("normal", `    ${atBat.batter.player.firstName} ${atBat.batter.player.lastName} drove in a run!`);
    } else if (this.onBase["2B"] && secondBaseMovements === 1) {
      this.onBase["3B"] = this.onBase["2B"];
      this.onBase["2B"] = null;
      this.game.logger.log("verbose", `    ${this.onBase["3B"]?.player.firstName} ${this.onBase["3B"]?.player.lastName} advanced to third.`);
    } 

    if(this.onBase["1B"] && firstBaseMovements === 3) {
      this.onBase["H"] = this.onBase["1B"];
      this.onBase["1B"] = null;
      rbi++;
      console.log("awarding an rbi from runner on 1B")
      this.game.logger.log("verbose", `    ${this.onBase["3B"]?.player.firstName} ${this.onBase["3B"]?.player.lastName} advanced to third.`);
    } else if (this.onBase["1B"] && firstBaseMovements === 2) {
      this.onBase["3B"] = this.onBase["1B"];
      this.onBase["1B"] = null;
      this.game.logger.log("verbose", `    ${this.onBase["2B"]?.player.firstName} ${this.onBase["2B"]?.player.lastName} advanced to second.`);
    } else if (this.onBase["1B"] && firstBaseMovements === 1) {
      this.onBase["2B"] = this.onBase["1B"];
      this.onBase["1B"] = null;
      this.game.logger.log("verbose", `    ${atBat.batter.player.firstName} ${atBat.batter.player.lastName} advanced to first.`);
    } 

    if(batterMovements === 4) {
      rbi++;
      console.log("awarding an rbi from batter")
      this.onBase.H = null;
      this.game.logger.log("normal", `    ${atBat.batter.player.firstName} ${atBat.batter.player.lastName} drove in a run!`);
    } else {
      this.onBase[batterMovesToBase] = batter;
      this.onBase.H = null;
      this.game.logger.log("quiet", `    ${atBat.batter.player.firstName} ${atBat.batter.player.lastName} to ${batterMovesToBase}.`);
    }
    if(rbi > 0) {
      inning.runs += rbi;
      this.game.logger.log("quiet", `    That was an incredible ${rbi} RBI play for ${atBat.batter.player.firstName} ${atBat.batter.player.lastName}.`);
    }
  }
}