import { AtBat } from "./at-bat";

export type Outcome = {
  runs: number;
  outs: number;
  atBats: AtBat[];
}
export class Inning {
  number: number;
  outcomes: {
    home: Outcome | null;
    away: Outcome | null;
  };
  state: "Top" | "Bottom" | "Complete";

  constructor(number: number) {
    this.number = number;
    this.outcomes = { home: null, away: null };
    this.state = "Top";
  }

  offensive(): Outcome {
    if(this.state === "Top") {
      this.outcomes.away = this.outcomes.away ?? { runs: 0, outs: 0, atBats: [] };
      return this.outcomes.away;
    } else {
      this.outcomes.home = this.outcomes.home ?? { runs: 0, outs: 0, atBats: [] };
      return this.outcomes.home;
    }
  }

}