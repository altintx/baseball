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
}