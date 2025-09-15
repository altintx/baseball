import { AtBat } from "./at-bat";

type Outcome = {
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
  
}