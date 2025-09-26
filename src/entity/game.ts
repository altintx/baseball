import { off } from "process";
import { AtBat } from "./at-bat";
import { Inning } from "./inning";
import { Team } from "./team";
import { TeamPlayer } from "./team-player";
import { Lineup } from "./lineup";
import { Field } from "./field";
import { GameTeam } from "./game-team";
import { Player } from "./player";
import { Pitch } from "./pitch";

export class Game {
  home: GameTeam;
  away: GameTeam;
  date: Date;
  innings: Inning[];
  winner: Team | null;
  positionInLineup: {
    home: number;
    away: number;
  };
  listeners: Record<string, ((...args: any[]) => unknown)[]> = {};
  logLevel: "debug" | "verbose" | "normal" | "quiet" = "quiet";

  shouldLog(level: "debug" | "verbose" | "normal" | "quiet"): boolean {
    const levels = ["quiet", "normal", "verbose", "debug"];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }
  
  constructor(hometeam: Team, awayteam: Team, date: Date) {
    const homeStartingPitcher = hometeam.bestPitcher();
    const awayStartingPitcher = awayteam.bestPitcher();
    const homeLineUp = new Lineup(hometeam, homeStartingPitcher, true);
    const awayLineUp = new Lineup(awayteam, awayStartingPitcher, true);
    this.home = new GameTeam(hometeam, homeLineUp);
    this.away = new GameTeam(awayteam, awayLineUp);
    this.date = date;
    this.innings = [];
    this.winner = null;
    this.positionInLineup = {
      home: 0,
      away: 0,
    }
  }

  winnerTeam(context: { inning: number; inningState: "Top" | "Bottom", outs: number }): Team | null {
    if(this.innings.length >= 9 && this.runs('home') > this.runs('away')) {
      return this.home.team;
    } else if(context.inning > 9 && context.inningState === "Bottom" && this.runs('away') > this.runs('home')) {
      return this.away.team;
    }
    return null;
  }

  simulate(): Game {
    const bullpens = {
      home: this.home.team.players.filter(p => p.position === "P" && p !== this.home.lineUp.positions["P"]),
      away: this.away.team.players.filter(p => p.position === "P" && p !== this.away.lineUp.positions["P"]),
    }
    for(let inning = 1; !this.winner || inning <= 9; inning++) {
      if(this.winner) break;
      this.innings.push(new Inning(inning));
      for(let team: "home" | "away" | null = "away"; team !== null && !this.winner; team = team === "away" ? "home" : null) {
        this.emit("inningChange", this.innings[this.innings.length - 1]);
        const currentInning = this.innings[this.innings.length - 1];
        currentInning.state = team === "away" ? "Top" : "Bottom";
        if(team === null) break;
        this.shouldLog("quiet") && console.log(`${currentInning.state} of the ${inning}th`);
        const offense = team === "away" ? this.away : this.home;
        const defense = team === "away" ? this.home : this.away;
        this.shouldLog("quiet") && console.log(`  ${offense.team.city} ${offense.team.name} is batting`);
        const outcome = currentInning.offensive();
        const field = new Field(defense.lineUp.positions, this)
        const atBats: AtBat[] = [];
        while (outcome.outs < 3) {
          const batter = offense.lineUp.positions[offense.lineUp.battingOrder[this.positionInLineup[team] % 9]];
          const atBat = field.atBat(batter, defense.lineUp.positions["P"], field);
          this.shouldLog("quiet") && console.log("atBat", atBat.batter.player.lastName, "vs", atBat.pitcher.player.lastName);
          do {
            const pitcherEnergy = atBat.pitcher.player.energy(this);
            if(pitcherEnergy < 80 && bullpens[team].length > 0) {
              this.shouldLog("verbose") && console.log(`  ${atBat.pitcher.player.lastName} is getting tired (energy ${pitcherEnergy}). Bringing in a reliever.`);
              const newPitcher = bullpens[team].shift()!;
              this.shouldLog("quiet") && console.log(`  ${newPitcher.player.lastName} is now pitching.`);
              defense.lineUp.positions["P"] = newPitcher;
              atBat.pitcher = newPitcher;
            } else if (pitcherEnergy < 50) {
              this.shouldLog("quiet") && console.log(`  Pitcher is exhausted and no ${defense.team.name} relievers are available. Giving up the game.`);
              outcome.outs = 3;
              this.winner = offense.team;
              break;
            }
            const result = atBat.simulate(this, currentInning);
            this.winner = this.winner ?? this.winnerTeam({ inning, inningState: currentInning.state, outs: outcome.outs });
            this.shouldLog("normal") && console.log(`  Pitch result: Balls: ${result.balls}, Strikes: ${result.strikes}`);
          } while (atBat.outcome === null);
          this.positionInLineup[team]++;
          atBats.push(atBat);
        }
        this.shouldLog("debug") && console.log(`End of ${currentInning.state} of the ${inning}th: ${this[team].team.name}'s pitcher ${this[team].lineUp.positions.P.player.lastName} has energy ${this[team].lineUp.positions.P.player.energy(this)}.`);
        this.winner = this.winner ?? this.winnerTeam({ inning, inningState: currentInning.state, outs: outcome.outs });
      }
    }
    return this;
  }
  
  runs(team: 'home' | 'away'): number {
    return this.innings.reduce((runs, inning) => (inning.outcomes[team]?.runs ?? 0) + runs, 0);
  }

  hits(team: 'home' | 'away'): number {
    return this.innings.reduce((hits, inning) => (inning.outcomes[team]?.atBats.filter(ab => ab.outcome === "Hit").length ?? 0) + hits, 0);
  }

  errors(team: 'home' | 'away'): number {
    return 0; // TODO: Implement errors
  }

  atBats(player: Player): AtBat[] {
    return this.innings.reduce<AtBat[]>((acc, inning) => {
      const awayAtBats = (inning.outcomes.away?.atBats ?? []).filter(ab => ab.batter.player === player); 
      const homeAtBats = (inning.outcomes.home?.atBats ?? []).filter(ab => ab.batter.player === player);
      return [...acc, ...awayAtBats, ...homeAtBats];
    }, [])
  }

  pitches(pitcher: Player): Pitch[] {
    return this.atBats(pitcher).flatMap(ab => ab.pitches);
  }

  on(event: string, listener: (...args: any[]) => void) {
    if(!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(listener);
  }

  off(event: string, listener: (...args: any[]) => void) {
    if(!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  emit(event: string, ...args: any[]) {
    if(!this.listeners[event]) return;
    for(const listener of this.listeners[event]) {
      listener(...args);
    }
  }
}