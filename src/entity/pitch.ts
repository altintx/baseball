import { Player } from "./player";

export const PitchTypes = ["Fastball", "Curveball", "Slider", "Changeup", "Sinker", "Cutter", "Knuckleball"] as const;
export type PitchType = typeof PitchTypes[number];
export class Pitch {
  pitcher: Player;
  batter: Player;
  speed: number; // in mph
  spinRate: number; // in rpm
  type: PitchType;

  constructor(pitcher: Player, batter: Player, speed: number, spinRate: number, type: PitchType) {
    this.pitcher = pitcher;
    this.batter = batter;
    this.speed = speed;
    this.spinRate = spinRate;
    this.type = type;
  }
}