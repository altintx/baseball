import { Game } from "../../../entity/game";
import { Team1 } from "../team/team1";
import { Team2 } from "../team/team2";

export const game1 = new Game(
  Team1,
  Team2,
  new Date(2024, 2, 15, 19, 0),
);
