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

  scheduleGames(params: { repeatsPerPair: number }): Game[] {
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

    // --- Step 2: Apply repeatsPerPair to create the pool ---
    const repeatedPairs: [Team, Team][] = [];
    for (let r = 0; r < params.repeatsPerPair; r++) {
      for (const p of pairs) repeatedPairs.push(p);
    }

    // target total games (each game involves two teams)
    const totalGamesTarget = Math.floor((this.teams.length * this.gamesPerTeam) / 2);

    // build game objects from repeatedPairs; repeat the cycle deterministically if pool too small
    const pool: Game[] = [];
    if (repeatedPairs.length === 0) return [];

    // create at least enough games by repeating the repeatedPairs sequence
    while (pool.length < totalGamesTarget) {
      for (const [home, away] of repeatedPairs) {
        pool.push(new Game(home, away, new Date(0))); // placeholder date
        if (pool.length >= totalGamesTarget) break;
      }
    }

    // if pool longer than needed (shouldn't be due to loop above), trim deterministically
    if (pool.length > totalGamesTarget) pool.length = totalGamesTarget;

    // --- Step 3: Deterministic shuffle of the pool to spread matchups ---
    // seed derived from stable inputs (team ids order, repeatsPerPair, date range, gamesPerTeam)
    const seedPayload = JSON.stringify({
      teamIds: this.teams.map((t) => t.abbreviation()),
      repeatsPerPair: params.repeatsPerPair,
      first: this.firstGameDate.toISOString(),
      last: this.lastGameDate.toISOString(),
      gamesPerTeam: this.gamesPerTeam,
    });
    const seed = hashStringToUInt32(seedPayload);
    seededShuffle(pool, seed);

    // --- Step 4: Date assignment ---
    const totalDays =
      Math.floor((this.lastGameDate.getTime() - this.firstGameDate.getTime()) / (24 * 3600 * 1000)) +
      1;
    const gamesPerDay = Math.ceil(totalGamesTarget / Math.max(1, totalDays));

    let gameIndex = 0;
    for (let day = 0; day < totalDays && gameIndex < totalGamesTarget; day++) {
      const date = new Date(this.firstGameDate.getTime());
      date.setDate(this.firstGameDate.getDate() + day);
      for (let g = 0; g < gamesPerDay && gameIndex < totalGamesTarget; g++) {
        // assign a fresh Date instance for each game (avoid shared Date mutation)
        pool[gameIndex].date = new Date(date.getTime());
        gameIndex++;
      }
    }

    // final schedule (deterministic given same Season state and params)
    this.schedule = pool.slice(0, totalGamesTarget);
    return this.schedule;
  }
}