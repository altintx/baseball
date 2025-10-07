import { hashStringToUInt32 } from "../util/hash";
import { seededShuffle } from "../util/shuffle";
import { Game } from "./game";
import { Team } from "./team";

export class Season {
  year: number;
  teams: Team[];
  schedule: Game[];
  firstGameDate: Date;
  lastGameDate: Date;
  gamesPerTeam: number;

  constructor(
    teams: Team[],
    firstGameDate: Date,
    lastGameDate: Date,
    gamesPerTeam: number
  ) {
    this.year = firstGameDate.getFullYear();
    this.teams = teams;
    this.firstGameDate = firstGameDate;
    this.lastGameDate = lastGameDate;
    this.gamesPerTeam = gamesPerTeam;
    this.schedule = [];
  }

  scheduleGames(params: { repeatsPerPair: number; daysBetweenSeries?: number }): Game[] {
    if (this.teams.length < 2) return [];

    // --- Step 1: Round-robin pair generation (balanced home/away) ---
    const pairs: [Team, Team][] = [];
    const numTeams = this.teams.length;
    const PLACEHOLDER: Team = {} as Team; // unique identity placeholder for odd team count
    const teamList =
      numTeams % 2 === 0 ? [...this.teams] : [...this.teams, PLACEHOLDER];

    const rounds = teamList.length - 1;
    for (let round = 0; round < rounds; round++) {
      for (let i = 0; i < teamList.length / 2; i++) {
        const home = teamList[i];
        const away = teamList[teamList.length - 1 - i];
        if (home !== PLACEHOLDER && away !== PLACEHOLDER) pairs.push([home, away]);
      }
      // rotate all but the first team
      teamList.splice(1, 0, teamList.pop()!);
    }

    // --- Step 2: Create consecutive game blocks for each pair ---
    // target total games (each game involves two teams)
    const totalGamesTarget = Math.floor((this.teams.length * this.gamesPerTeam) / 2);

    // create consecutive blocks of games for each pair
    const gameBlocks: Game[][] = [];
    const gamesPerBlock = params.repeatsPerPair;
    
    // calculate how many cycles we need to reach the target
    const maxGamesFromOneCycle = pairs.length * gamesPerBlock;
    const cyclesNeeded = Math.ceil(totalGamesTarget / maxGamesFromOneCycle);
    
    let remainingGames = totalGamesTarget;
    
    // build multiple cycles if needed
    for (let cycle = 0; cycle < cyclesNeeded && remainingGames > 0; cycle++) {
      for (const [home, away] of pairs) {
        if (remainingGames <= 0) break;
        
        // create a block of consecutive games for this pair
        const block: Game[] = [];
        const gamesToAdd = Math.min(gamesPerBlock, remainingGames);
        
        for (let i = 0; i < gamesToAdd; i++) {
          block.push(new Game(home, away, new Date(0))); // placeholder date
        }
        
        if (block.length > 0) {
          gameBlocks.push(block);
          remainingGames -= block.length;
        }
      }
    }

    // --- Step 3: Shuffle the order of game blocks (not individual games) ---
    // seed derived from stable inputs (team ids order, repeatsPerPair, date range, gamesPerTeam)
    const seedPayload = JSON.stringify({
      teamIds: this.teams.map((t) => t.abbreviation()),
      repeatsPerPair: params.repeatsPerPair,
      first: this.firstGameDate.toISOString(),
      last: this.lastGameDate.toISOString(),
      gamesPerTeam: this.gamesPerTeam,
    });
    const seed = hashStringToUInt32(seedPayload);
    seededShuffle(gameBlocks, seed);

    // flatten blocks back into a single pool while preserving consecutive games within blocks
    const pool: Game[] = [];
    for (const block of gameBlocks) {
      pool.push(...block);
    }

    // --- Step 4: Date assignment with venue and team conflict resolution and series gaps ---
    const totalDays =
      Math.floor((this.lastGameDate.getTime() - this.firstGameDate.getTime()) / (24 * 3600 * 1000)) +
      1;
    
    // configure gaps between series (default to spread games across full season)
    const daysBetweenSeries = params.daysBetweenSeries ?? Math.max(1, Math.floor(totalDays / gameBlocks.length) - params.repeatsPerPair);
    
    // track which venues are occupied on which days
    const venueSchedule = new Map<string, Set<number>>(); // venueId -> set of occupied days
    // track which teams are busy on which days
    const teamSchedule = new Map<string, Set<number>>(); // teamId -> set of occupied days
    
    // assign dates to game blocks, ensuring no venue or team conflicts and proper spacing
    let gameIndex = 0;
    let currentDay = 0; // simplified: just try to pack games efficiently
    
    for (const block of gameBlocks) {
      // find the earliest consecutive days where this block can be scheduled
      let startDay = currentDay;
      let canScheduleBlock = false;
      let attempts = 0;
      const maxAttempts = totalDays * 2; // prevent infinite loops
      
      // try different start days until we find one that works for the entire block
      while (attempts < maxAttempts && !canScheduleBlock) {
        canScheduleBlock = true;
        
        // get team and venue identifiers for this block
        const homeVenueId = block[0].home.team.abbreviation();
        const homeTeamId = block[0].home.team.abbreviation();
        const awayTeamId = block[0].away.team.abbreviation();
        
        // check if all days in this block are available for venue and teams
        for (let dayOffset = 0; dayOffset < block.length; dayOffset++) {
          const day = (startDay + dayOffset) % totalDays; // wrap around calendar
          
          // check venue availability
          const occupiedDays = venueSchedule.get(homeVenueId) || new Set<number>();
          if (occupiedDays.has(day)) {
            canScheduleBlock = false;
            break;
          }
          
          // check home team availability
          const homeTeamOccupied = teamSchedule.get(homeTeamId) || new Set<number>();
          if (homeTeamOccupied.has(day)) {
            canScheduleBlock = false;
            break;
          }
          
          // check away team availability
          const awayTeamOccupied = teamSchedule.get(awayTeamId) || new Set<number>();
          if (awayTeamOccupied.has(day)) {
            canScheduleBlock = false;
            break;
          }
        }
        
        if (!canScheduleBlock) {
          startDay = (startDay + 1) % totalDays;
          attempts++;
        }
      }
      
      // if we couldn't find a perfect slot, force schedule anyway
      if (!canScheduleBlock) {
        startDay = currentDay % totalDays;
      }
      
      // assign dates to games in this block and mark venue and teams as occupied
      const homeVenueId = block[0].home.team.abbreviation();
      const homeTeamId = block[0].home.team.abbreviation();
      const awayTeamId = block[0].away.team.abbreviation();
      
      // initialize tracking sets if needed
      if (!venueSchedule.has(homeVenueId)) {
        venueSchedule.set(homeVenueId, new Set<number>());
      }
      if (!teamSchedule.has(homeTeamId)) {
        teamSchedule.set(homeTeamId, new Set<number>());
      }
      if (!teamSchedule.has(awayTeamId)) {
        teamSchedule.set(awayTeamId, new Set<number>());
      }
      
      const occupiedDays = venueSchedule.get(homeVenueId)!;
      const homeTeamOccupied = teamSchedule.get(homeTeamId)!;
      const awayTeamOccupied = teamSchedule.get(awayTeamId)!;
      
      for (let i = 0; i < block.length; i++) {
        const day = (startDay + i) % totalDays; // wrap around if necessary
        
        // mark venue and both teams as occupied
        occupiedDays.add(day);
        homeTeamOccupied.add(day);
        awayTeamOccupied.add(day);
        
        const date = new Date(this.firstGameDate.getTime());
        date.setDate(this.firstGameDate.getDate() + day);
        
        // assign a fresh Date instance for each game (avoid shared Date mutation)
        pool[gameIndex].date = new Date(date.getTime());
        gameIndex++;
      }
      
      // advance the current day to create gaps between series
      currentDay = startDay + block.length + daysBetweenSeries;
    }

    // final schedule (deterministic given same Season state and params)
    this.schedule = pool.slice(0, totalGamesTarget).sort((a, b) => {
      const diff = a.date.getTime() - b.date.getTime();
      if(diff !== 0) return diff;
      // same date, sort by home team abbreviation
      const homeDiff = a.home.team.abbreviation().localeCompare(b.home.team.abbreviation());
      if(homeDiff !== 0) return homeDiff;
      // same home team, sort by away team abbreviation
      return a.away.team.abbreviation().localeCompare(b.away.team.abbreviation());
    })
    return this.schedule;
  }

  standings(): { team: Team; wins: number; losses: number; winPct: number }[] {
    const records: Record<string, { team: Team; wins: number; losses: number }> = {};
    for (const team of this.teams) {
      records[team.abbreviation()] = { team, wins: 0, losses: 0 };
    }
    for (const game of this.schedule) {
      if (game.runs('home') > game.runs('away')) {
        records[game.home.team.abbreviation()].wins++;
        records[game.away.team.abbreviation()].losses++;
      } else if (game.runs('away') > game.runs('home')) {
        records[game.away.team.abbreviation()].wins++;
        records[game.home.team.abbreviation()].losses++;
      }
      // ties are ignored for simplicity
    }
    const standings = Object.values(records).map(r => ({
      team: r.team,
      wins: r.wins,
      losses: r.losses,
      winPct: r.wins + r.losses > 0 ? r.wins / (r.wins + r.losses) : 0
    }));
    standings.sort((a, b) => b.winPct - a.winPct || b.wins - a.wins);
    return standings;
  }
}