import { Game } from "../../../entity/game";
import { baltimoreFederals } from "../team/baltimore-federals";
import { cheyenneBaldEagles } from "../team/cheyenne-bald-eagles";

export const game1 = new Game(
  baltimoreFederals,
  cheyenneBaldEagles,
  new Date(2024, 2, 15, 19, 0),
);
