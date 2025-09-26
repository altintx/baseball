import { Game } from "./game";
import { Player } from "./player";

export const PitchTypes = ["Fastball", "Curveball", "Slider", "Changeup", "Sinker", "Cutter", "Knuckleball"] as const;
export type PitchType = typeof PitchTypes[number];
export class Pitch {
  game: Game;
  pitcher: Player;
  batter: Player;
  speed: number; // in mph
  spinRate: number; // in rpm
  type: PitchType;

  constructor(game: Game, pitcher: Player, batter: Player, speed: number, spinRate: number, type: PitchType) {
    this.game = game;
    this.pitcher = pitcher;
    this.batter = batter;
    this.speed = speed;
    this.spinRate = spinRate;
    this.type = type;
  }

  simulate(): { type: "Ball" | "Strike" | "Foul" | "InPlay", location: "InZone" | "OutOfZone" } {
    // Determine if pitch is a ball or strike based on pitcher's accuracy and batter's eye
    const pitcherAccuracy = (this.pitcher.playerAttributes().Dexterity * 0.5 + this.pitcher.playerAttributes().Intelligence * 0.5) / 200;
    const batterEye = (this.batter.playerAttributes().Intelligence * 0.7 + this.batter.playerAttributes().Dexterity * 0.3) / 200;
    const strikeZoneChance = pitcherAccuracy - batterEye + 0.5; // base 50% chance of being in strike zone
    const isInZone = Math.random() < strikeZoneChance;

    if(isInZone) {
      // In strike zone, determine if batter swings and if it's a hit or miss
      const batterContact = (this.batter.playerAttributes().Dexterity * 0.6 + this.batter.playerAttributes().Strength * 0.4) / 200;
      const swingChance = batterContact + 0.3; // base 30% chance of swinging at strike
      if(Math.random() < swingChance) {
        // Batter swings, determine if it's a hit or miss
        const hitChance = batterContact - (this.pitcher.playerAttributes().Dexterity * 0.4 + this.pitcher.playerAttributes().Intelligence * 0.6) / 200 + 0.3; // base 30% chance of hit
        if(Math.random() < hitChance) {
          return { type: "InPlay", location: "InZone" }; // Hit
        } else {
          return { type: "Strike", location: "InZone" }; // Swing and miss
        }
      } else {
        return { type: "Strike", location: "InZone" }; // Called strike
      }
    } else {
      // Out of strike zone, determine if batter swings
      const batterDiscipline = (this.batter.playerAttributes().Intelligence * 0.6 + this.batter.playerAttributes().Dexterity * 0.4) / 200;
      const swingChance = 0.2 - batterDiscipline; // base 20% chance of swinging at ball
      if(Math.random() < swingChance) {
        // Batter swings, determine if it's a hit or miss
        const hitChance = (this.batter.playerAttributes().Dexterity * 0.5 + this.batter.playerAttributes().Strength * 0.5) / 200 - (this.pitcher.playerAttributes().Dexterity * 0.4 + this.pitcher.playerAttributes().Intelligence * 0.6) / 200 + 0.2; // base 20% chance of hit
        if(Math.random() < hitChance) {
          return { type: "InPlay", location: "OutOfZone" }; // Hit
        } else {
          return { type: "Foul", location: "OutOfZone" }; // Foul ball
        }
      } else {
        return { type: "Ball", location: "OutOfZone" }; // Called ball
      }
    }
  }

  static randomPitch(pitcher: Player, batter: Player, game: Game): Pitch {
    // Determine pitch type based on pitcher attributes, the pitcher's remaining energy, and the matchup between pitcher and batter's dexterity
    const pitcherEnergy = pitcher.energy(game);
    const [str, dex, wis] = [
      pitcher.roll("Strength", 20),
      pitcher.roll("Dexterity", 20),
      pitcher.roll("Wisdom", 20),
    ];
    const pitch = Math.min(str, dex, wis);
    const randomPitchIndex = Math.floor((pitch / 20) * PitchTypes.length);
    // if pitcher has energy and batter+pitcher have same dexterity, more likely to throw fastball
    // if pitcher has low energy but they have same dexterity, more likely to throw offspeed
    // if pitcher has energy and they have different dexterity, more likely to throw a tricky pitch
    // if pitcher has low energy and they have different dexterity, more likely to throw fastball slowly (to benefit batter)
    const sameDexterity = pitcher.dexterity === batter.dexterity;
    const hasEnergy = pitcherEnergy > 75;
    if(sameDexterity && hasEnergy) {
      if(wis > 15) {
        return new Pitch(game, pitcher, batter, 90 + pitcher.roll('Strength', 20), 2000 + Math.random() * 1000, "Fastball");
      } else {
        return new Pitch(game, pitcher, batter, 70 + pitcher.roll('Strength', 12), 1000 + Math.random() * 2000, PitchTypes[randomPitchIndex]);
      }
    } else if(sameDexterity && !hasEnergy) {
      if(str > 15) {
        return new Pitch(game, pitcher, batter, 80 + pitcher.roll('Strength', 12), 1500 + Math.random() * 1000, "Fastball");
      } else {
        return new Pitch(game, pitcher, batter, 60 + pitcher.roll('Strength', 20), 1000 + Math.random() * 2000, PitchTypes[randomPitchIndex]);
      }
    } else if(!sameDexterity && hasEnergy) {
      if(wis > 12) {
        return new Pitch(game, pitcher, batter, 90 + pitcher.roll('Strength', 12), 2000 + Math.random() * 1000, "Fastball");
      } else {
        return new Pitch(game, pitcher, batter, 70 + pitcher.roll('Strength', 8), 1000 + Math.random() * 2000, PitchTypes[randomPitchIndex]);
      }
    }
    else { // !sameDexterity && !hasEnergy
      if(dex > 15) {
        return new Pitch(game, pitcher, batter, 75 + pitcher.roll('Strength', 8), 1500 + Math.random() * 1000, "Fastball");
      } else {
        return new Pitch(game, pitcher, batter, 60 + pitcher.roll('Strength', 12), 1000 + Math.random() * 2000, PitchTypes[randomPitchIndex]);
      }
    }
  }
}