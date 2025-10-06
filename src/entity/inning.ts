import { AtBat } from "./at-bat";
import { Field } from "./field";
import { Game } from "./game";
import { TeamPlayer } from "./team-player";

export type Outcome = {
  runs: number;
  outs: number;
  atBats: AtBat[];
}
export class Inning {
  game: Game;
  number: number;
  outcomes: {
    home: Outcome | null;
    away: Outcome | null;
  };
  state: "Top" | "Bottom" | "Complete";
  homeField?: Field;
  awayField?: Field;

  constructor(number: number, game: Game) {
    this.number = number;
    this.outcomes = { home: null, away: null };
    this.state = "Top";
    this.game = game;
  }

  offensive(): Outcome {
    if(this.state === "Top") {
      this.outcomes.away ??= { runs: 0, outs: 0, atBats: [] };
      return this.outcomes.away;
    } else {
      this.outcomes.home ??= { runs: 0, outs: 0, atBats: [] };
      return this.outcomes.home;
    }
  }

  defensive(): Outcome {
    if(this.state === "Bottom") {
      this.outcomes.away ??= { runs: 0, outs: 0, atBats: [] };
      return this.outcomes.away;
    } else {
      this.outcomes.home ??= { runs: 0, outs: 0, atBats: [] };
      return this.outcomes.home;
    }
  }

  field(): Field {
    const team = this.state === "Top" ? "away" : "home";
    const defense = this.game[team];
    if(team === "away") {
      this.awayField ??= new Field(defense.lineUp.positions, this.game);
      return this.awayField;
    } else {
      this.homeField ??= new Field(defense.lineUp.positions, this.game);
      return this.homeField;
    }
  }

  atBat(batter: TeamPlayer, pitcher: TeamPlayer, inning: Inning): AtBat {
    const f = this.field();
    f.onBase.H = batter;
    const atBat = new AtBat({ batter, pitcher, field: f, balls: 0, strikes: 0 });
    this.offensive().atBats.push(atBat);
    return atBat;
  }
  
}