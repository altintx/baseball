import { AtBat } from "./at-bat";
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
}