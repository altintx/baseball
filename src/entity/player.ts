import { PlayerAttributeBucket, PlayerAttributeBuckets, PlayerAttributePoint } from "./player-attribute-point";
import { TeamPlayer } from "./team-player";
import usa from '../names/usa.json';
import japan from '../names/japan.json';
import canada from '../names/canada.json';
import puertoRico from '../names/puerto-rico.json';
import southKorea from '../names/south-korea.json';
import mexico from '../names/mexico.json';
import cuba from '../names/cuba.json';
import { Countries, Country } from "./country";
import { Gender, Genders } from "./gender";
import { Dexterity } from "./dexterity";
import { Game } from "./game";
import { AtBat } from "./at-bat";
import { Inning } from "./inning";
import { Pitch } from "./pitch";

type NameEntry = { name: string; weight: number };
type CountryData = {
  male: NameEntry[];
  female: NameEntry[];
  neutral: NameEntry[];
  last: NameEntry[];
};

const namesByCountry: Record<Country, CountryData> = {
  USA: usa,
  Japan: japan,
  Canada: canada,
  "Puerto Rico": puertoRico,
  "South Korea": southKorea,
  Mexico: mexico,
  Cuba: cuba,
};

function weightedChoice(arr: NameEntry[], temperature: number): string {
  if(temperature >= 1 || temperature < 0) throw new Error(`Temperature must be between 0 and 1`);
  const total = arr.reduce((acc, e) => acc + e.weight, 0);
  let r = temperature * total;
  for (const e of arr) {
    if (r < e.weight) return e.name;
    r -= e.weight;
  }
  return arr[arr.length - 1].name;
}

export function generateFirstName(
  country: Country,
  gender: Gender,
  temperature: number
): string {
    if(temperature >= 1 || temperature < 0) throw new Error(`Temperature must be between 0 and 1`);
  const data = namesByCountry[country];
  if (!data) throw new Error(`Unsupported country: ${country}`);
  // ~25% chance of neutral substitution
  if (temperature < 0.25 && data.neutral.length > 0) {
    return weightedChoice(data.neutral, temperature);
  }
  return weightedChoice(data[gender], temperature);
}

export function generateLastName(country: Country, temperature: number): string {
  return weightedChoice(namesByCountry[country].last, temperature);
}



export class Player {
  firstName: string;
  lastName: string;
  country: Country;
  gender: Gender;
  proficencies: PlayerAttributePoint[];
  dexterity: Dexterity;

  hp: number;
  experience: number;

  static defaultAttributeValue = 9;

  constructor(attributes: { firstName: string, lastName: string, attributes: PlayerAttributePoint[], country?: Country, gender?: Gender, dexterity?: Dexterity }) {
    this.firstName = attributes.firstName;
    this.lastName = attributes.lastName;
    this.proficencies = attributes.attributes;
    this.country = attributes.country ?? "USA";
    this.gender = attributes.gender ?? "male";
    this.dexterity = attributes.dexterity ?? "Right";
    this.hp = 100;
    this.experience = 0;
  }

  battingSide(format: "brief"): string {
    if (this.dexterity === "Ambidextrous") {
      return format === "brief" ? "S" : "Ambidextrous";
    }
    return this.dexterity === "Right" ? (format === "brief" ? "R" : "Right") : (format === "brief" ? "L" : "Left");
  }
  
  static generate<TCountry extends Country, TGender extends Gender>(
    temperature: number,
    country: TCountry,
    gender: TGender
  ): Player {
    const dexterity = (temperature < 0.05 ? "Ambidextrous" as const: Math.random() < 0.6 ? "Right" as const : "Left" as const);
    const attributes: PlayerAttributePoint[] = [];
    for(let type of PlayerAttributeBuckets) {
      attributes.push(new PlayerAttributePoint({ type, value: Player.defaultAttributeValue }));
    }
    const playerAttributes = {
      firstName: generateFirstName(country, gender, temperature),
      lastName: generateLastName(country, temperature),
      gender,
      country,
      attributes,
      dexterity
    };
    return new Player(playerAttributes);
  }

  playerAttributes(): Record<PlayerAttributeBucket, number> {
    const result: Record<PlayerAttributeBucket, number> = {
      Strength: 0,
      Intelligence: 0,
      Dexterity: 0,
      Charisma: 0,
      Constitution: 0,
      Wisdom: 0
    };
    for (const point of this.proficencies) {
      if (point.type) {
        result[point.type] += point.value;
      }
    }
    return result;
  }

  energy(game: Game): number {
    const { Constitution } = this.playerAttributes();
    const tp = game.home.team.players.find(tp => tp.player === this) ?? game.away.team.players.find(tp => tp.player === this);
    if(!tp) throw new Error(`Player ${this.firstName} ${this.lastName} not found in either team for given game`);
    if(tp.position !== "P") {
      return Math.max(100, this.hp + Constitution * 2);
    } else {
      // Pitchers get fatigued faster
      const pitches = game.pitches(this).length;
      return 75 - pitches + Constitution * 2;
    }
  }

  roll(attribute: PlayerAttributeBucket, dice: 4 | 6 | 8 | 12 | 20, options?: { buff?: number }): number {
    const buff = this.playerAttributes()[attribute] - Player.defaultAttributeValue;
    const random = 1 + Math.floor(Math.random() * dice);
    return Math.max(1, Math.min(dice, (options?.buff ?? 0) + buff + random));
  }

  willTryToSteal(context: { atBat: AtBat, inning: Inning; scoreDifference: number; me: TeamPlayer }): boolean {
    if(context.inning.offensive().outs === 2) return false; // silly to steal with no outs to burn
    const myBase = Object.entries(context.atBat.field.onBase).find(([base, player]) => player === context.me)?.[0];
    if(!myBase) return false; // I'm not on base, so I can't steal
    if(myBase === "3B") return false; // no reason to steal home (for now)
    const nextBase = myBase === "1B" ? "2B" : "3B";
    if(context.atBat.field.onBase[nextBase]) return false; // next base is occupied, can't steal 
    if(context.scoreDifference < -3) return false; // losing by a lot, no reason to steal
    if(context.scoreDifference > 3) return true; // winning by a lot, steal to add insurance
    if(context.inning.number >= 8 && context.scoreDifference > 0) return true; // late in the game and winning, steal to add insurance
    if(context.inning.number >= 8 && context.scoreDifference < 0) return false; // late in the game and losing, no reason to steal
    const shouldTry = context.me.player.roll("Dexterity", 20) > 15;
    if (shouldTry) {
      const pitcherPickOff = context.atBat.pitcher.player.roll("Intelligence", 20);
      const catcherThrow = context.atBat.field.fielders.C.player.roll("Dexterity", 20);
      return context.me.player.roll("Dexterity", 20, { buff: 2 }) > (pitcherPickOff + catcherThrow);
    }
    return false; // default to not stealing
  }
  willTryToBunt(context: { atBat: AtBat, inning: Inning, scoreDifference: number; pitcher: Player; catcher: Player; }): boolean {
    const inningState = context.inning.offensive();
    if(inningState.outs === 2) return false; // silly to bat with no outs to burn 
    const playersOnBase = context.atBat.field.runnersOnBase();
    if(playersOnBase === 0) return false; // no one on base, no reason to bunt
    if(context.scoreDifference < -3) return false; // losing by a lot, no reason to bunt
    if(context.scoreDifference > 3) return true; // winning by a lot, bunt to waste an out
    if(context.inning.number >= 8 && context.scoreDifference > 0) return true; // late in the game and winning, bunt to waste an out
    if(context.inning.number >= 8 && context.scoreDifference < 0) return false; // late in the game and losing, no reason to bunt
    if(inningState.outs === 1 && playersOnBase === 2) return true; // one out and two on, good chance to move them up
    if(inningState.outs === 1 && playersOnBase === 1) {
      const baseOccupied = Object.entries(context.atBat.field.onBase).find(([_base, player]) => player)?.[0];
      if(baseOccupied === "3B") return false; // no reason to bunt with only 3rd base occupied
      return true; // good chance to move them up
    }
    if(inningState.outs === 0 && playersOnBase === 2) {
      const basesOccupied = Object.entries(context.atBat.field.onBase).filter(([base, player]) => player).map(([base, player]) => base);
      if(basesOccupied.includes("2B") && basesOccupied.includes("3B")) return false; // no reason to bunt with 2nd and 3rd occupied
      return true; // good chance to move them up
    }
    if(inningState.outs === 0 && playersOnBase === 1) {
      const baseOccupied = Object.entries(context.atBat.field.onBase).find(([base, player]) => player)?.[0];
      if(baseOccupied === "3B") return false; // no reason to bunt with only 3rd base occupied
      return true; // good chance to move them up
    }
    return false; // default to not bunting
  }

  willSwing(context: { pitch: Pitch }): boolean {
    const intelligenceCheck = this.roll("Intelligence", 20) > 12;
    if(intelligenceCheck) {
      const pitch = context.pitch;
      if(!pitch) return false; // no pitch, can't swing
      if(pitch.inStrikeZone) {
        return true; // good pitch, swing
      } else {
        const dexterityCheck = this.roll("Dexterity", 20) > 12;
        return !dexterityCheck; // bad pitch, swing only if not very dexterous
      }
    } else {
      return this.roll("Dexterity", 20, { buff: context.pitch.difficultyBuff() }) > 8;
    }
    // chance to swing is based on dexterity and intelligence
  }

  will(action: "swing" | "take" | "bunt" | "steal" | "catch" | "check" | "tag" | "force" | "throw", context: { game: Game, atBat: AtBat, inning: Inning; me: TeamPlayer; pitcher: Player; catcher: Player, pitch: Pitch | null }): boolean {
    switch(true) {
      case action === "swing" && !!context.pitch: {
        return this.willSwing({ pitch: context.pitch! });
      }
      case action === "swing" && !context.pitch: {
        return false;
      }
      case action === "take": {
        return !this.willSwing({ pitch: context.pitch! });
      }
      case action === "bunt": {
        return this.willTryToBunt({ atBat: context.atBat, inning: context.inning, scoreDifference: context.game.runs('away') - context.game.runs('home'), pitcher: context.pitcher, catcher: context.catcher });
      }
      case action === "steal": {
        return this.willTryToSteal({ atBat: context.atBat, inning: context.inning, scoreDifference: context.game.runs('away') - context.game.runs('home'), me: context.me });
      }
      case action === "catch": {
        return this.roll("Dexterity", 20) > 10;
      }
      case action === "check": {
        return this.roll("Intelligence", 20) > 10;
      }
      case action === "tag": {
        return this.roll("Dexterity", 20) > 10;
      }
    }
    return false;
  }
}