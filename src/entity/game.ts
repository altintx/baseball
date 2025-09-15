import { off } from "process";
import { AtBat } from "./at-bat";
import { Inning } from "./inning";
import { Team } from "./team";
import { TeamPlayer } from "./team-player";
import { Lineup } from "./lineup";
import { Field } from "./field";
import { GameTeam } from "./game-team";

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

  simulate(): Game {
    for(let inning = 1; inning <= 9; inning++) {
      this.innings.push(new Inning(inning));
      for(let team: "home" | "away" | null = "away"; team !== null; team = team === "away" ? "home" : null) {
        const currentInning = this.innings[this.innings.length - 1];
        currentInning.state = team === "away" ? "Top" : "Bottom";
        if(team === null) break;
        console.log(`${currentInning.state} of the ${inning}th`);
        const offense = team === "away" ? this.away : this.home;
        const defense = team === "away" ? this.home : this.away;
        let outs = 0;
        let runs = 0;
        const field = new Field(defense.lineUp.positions)
        const atBats: AtBat[] = [];
        while (outs < 3) {
          const batter = offense.lineUp.positions[offense.lineUp.battingOrder[this.positionInLineup[team] % 9]];
          const atBat = field.atBat(batter, defense.lineUp.positions["P"]);
          console.log("atBat", atBat.batter.player.lastName, "vs", atBat.pitcher.player.lastName);
          do {
            const result = atBat.simulate();
            console.log(`  Pitch result: Balls: ${result.balls}, Strikes: ${result.strikes}`);
            if(result.outcome) console.log(`  AtBat outcome: ${result.outcome}`);
            switch (result.outcome) {
              case "Error":
              case "Out":
                outs++;
                break;
              case "Hit":
                runs++;
                break;
              case "Walk":
                break;
            }
          } while (atBat.outcome === null);
          this.positionInLineup[team]++;
          atBats.push(atBat);
        }
      }
    }
    this.runs('home') > this.runs('away') ? this.winner = this.home.team : this.runs('away') > this.runs('home') ? this.winner = this.away.team : null;
    if(!this.winner) {
      console.log("The game is tied after 9 innings. Extra innings are not yet implemented.");
      console.log("Home team wins!");
      this.winner = this.home.team;
    }
    return this;
  }
  
  runs(team: 'home' | 'away'): number {
    return this.innings.reduce((runs, inning) => (inning.outcomes[team]?.runs ?? 0) + runs, 0);
  }
}