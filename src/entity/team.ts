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

  abbreviation(): string {
    const cityParts = this.city.split(" ");
    const teamNameParts = this.name.split(" ");
    // if teamNameParts.length >= 2, use first letter of cityParts[0] and teamNameParts[0] and teamNameParts[1]
    // if teamNameParts.length === 1, and cityParts.length >= 2, use first letter of cityParts[0] and cityParts[1] and teamNameParts[0]
    // if teamNameParts.length === 1, and cityParts.length === 1, use first two letters of cityParts[0] and first letter of teamNameParts[0]
    if(teamNameParts.length >= 2) {
      return (cityParts[0][0] + teamNameParts[0][0] + teamNameParts[1][0]).toUpperCase();
    } else if(cityParts.length >= 2) {
      return (cityParts[0][0] + cityParts[1][0] + teamNameParts[0][0]).toUpperCase();
    } else {
      return (cityParts[0].slice(0, 2) + teamNameParts[0][0]).toUpperCase();
    }
  }
}