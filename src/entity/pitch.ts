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
  inStrikeZone: boolean | null = null;

  constructor(game: Game, pitcher: Player, batter: Player, speed: number, spinRate: number, type: PitchType) {
    this.game = game;
    this.pitcher = pitcher;
    this.batter = batter;
    this.speed = speed;
    this.spinRate = spinRate;
    this.type = type;
  }

  difficultyBuff(): number {
    switch(this.type) {
      case"Changeup": return 2;
      case"Curveball": return 1;
      case"Cutter": return 0;
      case"Fastball": return 0;
      case"Sinker": return -1;
      case"Slider": return -1;
      case"Knuckleball": return -2;
      default: return 0;
    }
  }

  simulate(): "InZone" | "OutOfZone" {
    const pitcherConstitutionRoll = this.pitcher.roll("Constitution", 4)
    const pitcherBuff = pitcherConstitutionRoll === 4 ? 1: pitcherConstitutionRoll === 1 ? -1 : 0;
    const pitchDifficultBuff = this.difficultyBuff();
    const pitcherDexterityRoll = this.pitcher.roll("Dexterity", 20) + pitcherBuff + pitchDifficultBuff;
    this.inStrikeZone = pitcherDexterityRoll > 12;
    return this.inStrikeZone ? "InZone" : "OutOfZone";
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
    const randomPitchIndex = Math.floor((pitch / 20.001) * PitchTypes.length);
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