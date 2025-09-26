import { Game } from "./game";
import { Player } from "./player";
import { PlayerPosition } from "./player-position";

export class TeamPlayer {
  player: Player;
  number: number;
  position: PlayerPosition;
  activeFrom: Date;
  activeTo: Date | null;

  constructor(attributes: {
    player: Player;
    number: number;
    position: PlayerPosition;
    activeFrom: Date;
    activeTo?: Date | null;
  }) {
    this.player = attributes.player;
    this.number = attributes.number;
    this.position = attributes.position;
    this.activeFrom = attributes.activeFrom;
    this.activeTo = attributes.activeTo ?? null;
  }

  awardExperience(amount: number, game: Game) {
    game.logger.log("debug",`   ${this.player.lastName} gains ${amount} experience points.`);
    this.player.experience += amount;
  }
}