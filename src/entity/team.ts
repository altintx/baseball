import { TeamPlayer } from "./team-player";
import { UniformColor } from "./uniform-color";

export class Team {
  players: TeamPlayer[];
  name: string;
  city: string;
  homeColor: [UniformColor, UniformColor];
  awayColor:[UniformColor, UniformColor];
  
  constructor(attributes: {
    name: string;
    city: string;
    homeColor: [UniformColor, UniformColor];
    awayColor: [UniformColor, UniformColor];
  }) {
    this.name = attributes.name;
    this.city = attributes.city;
    this.homeColor = attributes.homeColor;
    this.awayColor = attributes.awayColor;
    this.players = [];
  }

  bestPitcher(): TeamPlayer {
    /* sort players by position === "P" and then by highest HP */
    const pitchers = this.players.filter(p => p.position === "P");
    if(pitchers.length === 0) throw new Error(`Team ${this.name} has no pitchers`);
    return pitchers.sort((a, b) => b.player.hp - a.player.hp)[0];
  }
}