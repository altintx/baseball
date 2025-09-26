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

function weightedChoice(arr: NameEntry[]): string {
  const total = arr.reduce((acc, e) => acc + e.weight, 0);
  let r = Math.random() * total;
  for (const e of arr) {
    if (r < e.weight) return e.name;
    r -= e.weight;
  }
  return arr[arr.length - 1].name;
}

export function generateFirstName(
  country: Country,
  gender: Gender
): string {
  const data = namesByCountry[country];
  if (!data) throw new Error(`Unsupported country: ${country}`);
  // ~25% chance of neutral substitution
  if (Math.random() < 0.25 && data.neutral.length > 0) {
    return weightedChoice(data.neutral);
  }
  return weightedChoice(data[gender]);
}

export function generateLastName(country: Country): string {
  return weightedChoice(namesByCountry[country].last);
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
  
  static generateRandomly<TCountry extends Country, TGender extends Gender>(
    country?: TCountry,
    gender?: TGender
  ): Player {
    const countryChoice = country ?? (Countries[(Countries.length * Math.random()) | 0] as TCountry);
    const genderChoice = gender ?? (Genders[(Genders.length * Math.random()) | 0] as TGender);
    const dexterity = (Math.random() < 0.05 ? "Ambidextrous" as const: Math.random() < 0.6 ? "Right" as const : "Left" as const);
    const attributes: PlayerAttributePoint[] = [];
    for(let type of PlayerAttributeBuckets) {
      attributes.push(new PlayerAttributePoint({ type, value: Player.defaultAttributeValue }));
    }
    const playerAttributes = {
      firstName: generateFirstName(countryChoice, genderChoice),
      lastName: generateLastName(countryChoice),
      gender,
      country,
      attributes,
      dexterity
    };
    return new Player(playerAttributes);
  }

  positions(): TeamPlayer[] {
    return [];
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

  roll(attribute: PlayerAttributeBucket, dice: 4 | 6 | 8 | 12 | 20): number {
    const buff = this.playerAttributes()[attribute] - 8;
    const random = 1 + Math.floor(Math.random() * dice);
    return Math.min(dice, buff + random);
  }
}