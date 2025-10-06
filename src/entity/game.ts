import { AtBat } from "./at-bat";
import { Inning } from "./inning";
import { Team } from "./team";
import { Lineup } from "./lineup";
import { Field } from "./field";
import { GameTeam } from "./game-team";
import { Player } from "./player";
import { Pitch } from "./pitch";
import { Observable } from "./observable";
import { LogLevel, LogLevels } from "../logging/level";
import { Logger } from "../logging/logger";
import { TeamPlayer } from "./team-player";

export class Game extends Observable{
  home: GameTeam;
  away: GameTeam;
  date: Date;
  innings: Inning[];
  winner: Team | null;
  positionInLineup: {
    home: number;
    away: number;
  };
  logger: Logger;
  
  constructor(hometeam: Team, awayteam: Team, date: Date, logLevel: LogLevel = "quiet") {
    super();
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
    this.logger = new Logger(logLevel);
  }

  winnerTeam(context: { inning: number; inningState: "Top" | "Bottom", outs: number }): Team | null {
    if(this.innings.length >= 9 && this.runs('home') > this.runs('away')) {
      return this.home.team;
    } else if(context.inning >= 9 && context.inningState === "Bottom" && this.runs('away') > this.runs('home')) {
      return this.away.team;
    }
    return null;
  }

  newInning(number: number): Inning {
    const inning = new Inning(number, this);
    if(this.innings.find(i => i.number === number)) {
      throw new Error(`Inning ${number} already exists`);
    }
    this.innings.push(inning);
    return inning;
  }

  currentBatter(team: "home" | "away"): TeamPlayer {
    const gameTeam = this[team];
    return gameTeam.lineUp.positions[gameTeam.lineUp.battingOrder[this.positionInLineup[team] % 9]];
  }

  simulate(): Game {
    for(let inning = 1; !this.winner || inning <= 9; inning++) {
      if(this.winner) break;
      const currentInning = this.newInning(inning);
      for(let team: "home" | "away" | null = "away"; team !== null && !this.winner; team = team === "away" ? "home" : null) {
        this.emit("inningChange", currentInning);
        currentInning.state = team === "away" ? "Top" : "Bottom";
        if(team === null) break;
        this.logger.log("quiet", `${currentInning.state} of the ${inning}th`);
        const offense = team === "away" ? this.away : this.home;
        const defense = team === "away" ? this.home : this.away;
        this.logger.log("quiet", `  ${offense.team.city} ${offense.team.name} is batting`);
        const outcome = currentInning.offensive();
        while (outcome.outs < 3) {
          const batter = this.currentBatter(team);
          const atBat = currentInning.atBat(batter, defense.lineUp.positions["P"], currentInning);
          this.logger.log("quiet", "atBat", atBat.batter.player.lastName, "vs", atBat.pitcher.player.lastName);
          do {
            const pitcherEnergy = atBat.pitcher.player.energy(this);
            if(pitcherEnergy < 80 && defense.bullPen().length > 0) {
              const newPitcher = defense.bullPen().shift()!;
              defense.relieve(atBat.pitcher, newPitcher);
              atBat.pitcher = newPitcher;
            } else if (pitcherEnergy < 50) {
              this.logger.log("quiet", `  Pitcher is exhausted and no ${defense.team.name} relievers are available. Giving up the game.`);
              outcome.outs = 3;
              this.winner = offense.team;
              break;
            }
            const result = atBat.simulate(this, currentInning);
            this.winner = this.winner ?? this.winnerTeam({ inning, inningState: currentInning.state, outs: outcome.outs });
            this.logger.log("normal",`  Pitch result: Balls: ${result.balls}, Strikes: ${result.strikes}`);
          } while (atBat.outcome === null);
          this.positionInLineup[team]++;
        }
        this.logger.log("debug", `End of ${currentInning.state} of the ${inning}th: ${this[team].team.name}'s pitcher ${this[team].lineUp.positions.P.player.lastName} has energy ${this[team].lineUp.positions.P.player.energy(this)}.`);
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
}