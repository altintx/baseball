// season.test.ts
import { describe, it, expect } from "vitest";
import { Season } from "./season"; // assumes your class is exported here
import { Team } from "./team";
import { baltimoreFederals } from "../test/fixture/team/baltimore-federals";

describe("Season.scheduleGames", () => {
  const teams = Array.from({ length: 8 }, (_, i) => new Team({ 
    name: `Team ${i + 1}`,
    city: "City",
    awayColor: baltimoreFederals.homeColor,
    homeColor: baltimoreFederals.awayColor,
    players: baltimoreFederals.players
  }));

  const startDate = new Date("2025-04-01");
  const endDate = new Date("2025-10-01");

  it("produces stable deterministic output", () => {

    const season1 = new Season(teams, startDate, endDate, 64);
    const season2 = new Season(teams, startDate, endDate, 64);

    const games1 = season1.scheduleGames({
      repeatsPerPair: 2,
    });

    const games2 = season2.scheduleGames({
      repeatsPerPair: 2,
    });

    expect(games1.length).toBe(games2.length);
    for (let i = 0; i < games1.length; i++) {
      expect(games1[i].home.team).toBe(games2[i].home.team);
      expect(games1[i].away.team).toBe(games2[i].away.team);
      expect(games1[i].date.getTime()).toBe(games2[i].date.getTime());
    }
  });

  it("respects start and end dates", () => {
    const season = new Season(teams, startDate, endDate, 40);
    const games = season.scheduleGames({
      repeatsPerPair: 1,
    });

    for (const g of games) {
      expect(g.date >= startDate).toBe(true);
      expect(g.date <= endDate).toBe(true);
    }
  });

  it("assigns consistent total games per team", () => {
    const season = new Season(teams, startDate, endDate, 64);
    const games = season.scheduleGames({
      repeatsPerPair: 2,
    });

    const counts: Record<string, number> = {};
    for (const t of teams) counts[t.name] = 0;

    for (const g of games) {
      counts[g.home.team.name]++;
      counts[g.away.team.name]++;
    }

    const values = Object.values(counts);
    const min = Math.min(...values);
    const max = Math.max(...values);
    expect(max - min).toBeLessThanOrEqual(1); // small rounding tolerance
  });
});