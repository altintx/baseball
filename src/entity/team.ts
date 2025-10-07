import { Cities } from "./city";
import { Countries } from "./country";
import { Genders } from "./gender";
import { BroadPosition, BroadPositions, Player } from "./player";
import { PlayerPosition, PlayerPositions } from "./player-position";
import { ActiveRoster } from "./roster";
import { TeamPlayer } from "./team-player";
import { UniformColor } from "./uniform-color";

export const TeamNames = [
  "Badgers", "Otters", "Comets", "Ravens", "Lynx", "Moose", "Meteors", "Cranes", "Thunders", "Coyotes",
  "Stallions", "Pelicans", "Cougars", "Beacons", "Fireflies", "Mustangs", "Bison", "Mariners", "Voyagers", "Avalanche",
  "Owls", "Prairie Dogs", "Jackrabbits", "Minks", "Marlins", "Raccoons", "Gophers", "Sparrows", "Condors", "Hawks",
  "Wolves", "Hurricanes", "Hornets", "Badlands", "Bobcats", "Crows", "Salamanders", "Rays", "Pandas", "Boars",
  "Gulls", "Eagles", "Cascades", "Ridges", "Timberwolves", "Huskies", "Falcons", "Foxes", "Caribou", "Sharks",
  "Vultures", "Tigersharks", "Rattlers", "Panthers", "Grizzlies", "Tortoises", "Crickets", "Phoenixes", "Serpents", "Titans",
  "Warthogs", "Bandits", "Praetorians", "Nomads", "Pioneers", "Voyageurs", "Highlanders", "Frontiers", "Corsairs", "Buccaneers",
  "Ironclads", "Steamers", "Locomotives", "Jets", "Orbiters", "Vortex", "Cyclones", "Tempests", "Thunderheads", "Blizzards",
  "Volcanoes", "Earthquakes", "Quasars", "Asteroids", "Commodores", "Captains", "Navigators", "Trailblazers", "Lumberjacks", "Miners",
  "Smelters", "Steelworkers", "Shipwrights", "Longshoremen", "Tanners", "Founders", "Forgers", "Alchemists", "Chemists", "Apothecaries",
  "Knights", "Samurai", "Ronin", "Gladiators", "Centurions", "Legionnaires", "Templars", "Crusaders", "Vikings", "Barbarians",
  "Rangers", "Hunters", "Trappers", "Wranglers", "Cowhands", "Roughnecks", "Dockers", "Marshals", "Outlaws", "Prospectors",
  "Sawmills", "Tinkers", "Mechanics", "Pilots", "Astronauts", "Meteorologists", "Cartographers", "Signalmen", "Sentinels", "Wardens",
  "Defenders", "Guardians", "Observers", "Specters", "Ghosts", "Phantoms", "Mirages", "Eclipses", "Nebulas", "Auroras",
  "Drifters", "Scribes", "Chroniclers", "Scholars", "Monks", "Hermits", "Pilgrims", "Wanderers", "Pathfinders", "Seekers"
];

export class Team {
  players: ActiveRoster;
  name: string;
  city: string;
  homeColor: [UniformColor, UniformColor];
  awayColor:[UniformColor, UniformColor];
  
  constructor(attributes: {
    name: string;
    city: string;
    homeColor: [UniformColor, UniformColor];
    awayColor: [UniformColor, UniformColor];
    players: ActiveRoster;
  }) {
    this.name = attributes.name;
    this.city = attributes.city;
    this.homeColor = attributes.homeColor;
    this.awayColor = attributes.awayColor;
    if(attributes.players.some(player => attributes.players.findIndex(otherPlayer => otherPlayer !== player && otherPlayer.number === player.number) !== -1)) {
      throw new Error(`Team ${this.name} has duplicate player numbers`);
    }
    this.players = attributes.players;
  }

  static assembleNewTeam(playerPool: Player[], city: string, name: string, draftDate: Date): Team {
    if(playerPool.length < 20) throw new Error("Not enough players in pool to assemble a team");
    const players: Player[] = [];
    const positions: BroadPosition[] = ["pitcher", "pitcher", "catcher", "catcher", "infielder", "infielder", "infielder", "infielder", "infielder", "outfielder", "outfielder", "outfielder", "outfielder", "outfielder"]
    for(let draft = 0; draft < 25; draft++) {
      const position = positions.shift();
      const pIndex = playerPool.findIndex((p) => position ? p.positionClassification === position : true);
      if(pIndex === -1) {
        throw new Error("Not enough players in pool to assemble a team with required positions");
      }
      players.push(playerPool.splice(pIndex, 1)[0]);
    }
    const positionsToFill: Record<BroadPosition, PlayerPosition[]> = {
      pitcher: Array.from({ length: 12 }, () => "P"),
      catcher: Array.from({ length: 12 }, () => "C"),
      infielder: ["1B", "2B", "3B", "SS", ...Array.from({ length: 12 }, () => "1B" as const)],
      outfielder: ["LF", "CF", "RF", ...Array.from({ length: 12 }, () => "LF" as const)]
    }
    const playerNumbers = new Set<number>();
    while(playerNumbers.size < players.length) {
      playerNumbers.add(1 + Math.floor(Math.random() * 99));
    }
    const playerNumbersValues = Array.from(playerNumbers);
    const team = new Team({
      name,
      city,
      players: players.map((p, i) => new TeamPlayer({
        player: p,
        position: positionsToFill[p.positionClassification].shift()!,
        number: playerNumbersValues.pop()!,
        activeFrom: draftDate,
        activeTo: null
      })) as ActiveRoster,
      homeColor: [
        new UniformColor({ name: "Primary", primaryColor: { r: Math.floor(50 + Math.random() * 205), g: Math.floor(50 + Math.random() * 205), b: Math.floor(50 + Math.random() * 205) }, detailColor: { r: Math.floor(50 + Math.random() * 205), g: Math.floor(50 + Math.random() * 205), b: Math.floor(50 + Math.random() * 205) } }),
        new UniformColor({ name: "Secondary", primaryColor: { r: Math.floor(50 + Math.random() * 205), g: Math.floor(50 + Math.random() * 205), b: Math.floor(50 + Math.random() * 205) }, detailColor: { r: Math.floor(50 + Math.random() * 205), g: Math.floor(50 + Math.random() * 205), b: Math.floor(50 + Math.random() * 205) } })
      ],
      awayColor: [
        new UniformColor({ name: "Primary", primaryColor: { r: Math.floor(50 + Math.random() * 205), g: Math.floor(50 + Math.random() * 205), b: Math.floor(50 + Math.random() * 205) }, detailColor: { r: Math.floor(50 + Math.random() * 205), g: Math.floor(50 + Math.random() * 205), b: Math.floor(50 + Math.random() * 205) } }),
        new UniformColor({ name: "Secondary", primaryColor: { r: Math.floor(50 + Math.random() * 205), g: Math.floor(50 + Math.random() * 205), b: Math.floor(50 + Math.random() * 205) }, detailColor: { r: Math.floor(50 + Math.random() * 205), g: Math.floor(50 + Math.random() * 205), b: Math.floor(50 + Math.random() * 205) } })
      ]
    });
    return team;
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