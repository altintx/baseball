import { Game } from "./game";
import { Player } from "./player";
import { PlayerPosition } from "./player-position";

const assignments: Map<Player, TeamPlayer> = new Map();
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
    if (assignments.has(this.player)) {
      throw new Error(`Player ${this.player.lastName} is already assigned to a team.`);
    } else {
      assignments.set(this.player, this);
    }
  }

  awardExperience(amount: number, game: Game) {
    game.logger.log("debug",`   ${this.player.lastName} gains ${amount} experience points.`);
    this.player.experience += amount;
  }

  toString() {
    return `${this.player.lastName} (#${this.number}, ${this.position})`;
  }
}