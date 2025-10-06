import { describe, expect, it, beforeEach } from "vitest";
import { p01 } from "../test/fixture/player/p01";
import { game1 } from "../test/fixture/game/game1";
import { Player } from "./player";

describe("player", () => {
  it("should bat from the proper side of the plate", () => {
    p01.dexterity = "Ambidextrous";
    expect(p01.battingSide("brief")).toBe("S");

    p01.dexterity = "Right";
    expect(p01.battingSide("brief")).toBe("R");
    
    p01.dexterity = "Left";
    expect(p01.battingSide("brief")).toBe("L");
  });

  it("should handle energy properly", () => {
    const initialEnergy = p01.energy(game1);
    // constitutition defaults to 9, which is doubled. Player should have no hit point. 
    expect(initialEnergy).toBe(118);
  });

  it("should buff rolls up appropriately", () => {
    for (const dice of [4, 6, 8, 12, 20] as const) {
      for (let rolls = 0; rolls < 100; rolls++) {
        const buff = 2;
        const roll = p01.roll("Strength", dice, { buff });
        expect(roll).toBeGreaterThanOrEqual(1 + buff);
        expect(roll).toBeLessThanOrEqual(dice);
      }
    }
  });
  it("should buff rolls down appropriately", () => {
    for (const dice of [4, 6, 8, 12, 20] as const) {
      for (let rolls = 0; rolls < 100; rolls++) {
        const buff = -2;
        const roll = p01.roll("Strength", dice, { buff});
        expect(roll).toBeGreaterThanOrEqual(1); // 1 + 2
        expect(roll).toBeLessThanOrEqual(dice + buff);
      }
    }
  });
  describe("batting stats", () => {
    beforeEach(() => {
      game1.innings.splice(0, game1.innings.length); // clear out any innings
    });
    it("should compute batting stats properly when they've never played", () => {
      const p = new Player({
        firstName: "Test",
        lastName: "Player",
        attributes: []
      });
      expect(p.battingStats([])).toEqual({
        games: 0,
        atBats: 0,
        hittingAverage: 0,
        onBasePercentage: 0,
        rbi: 0
      })
    });
    it("should compute batting stats from games they've played", () => {
      const tp = game1.away.team.players[0];
      const p = tp.player;
      const i = game1.newInning(1);
      const ab = i.atBat(tp, game1.home.team.players.find(tp => tp.position === "P")!, i);
      ab.rbi = 1;
      ab.outcome = "Hit";
      expect(p.battingStats([game1])).toEqual({
        games: 1,
        atBats: 1,
        hittingAverage: 1,
        onBasePercentage: 1,
        rbi: 1
      });
      const ab2 = i.atBat(tp, game1.home.team.players.find(tp => tp.position === "P")!, i);
      ab2.outcome = "Out";
      expect(p.battingStats([game1])).toEqual({
        games: 1,
        atBats: 2,
        hittingAverage: 0.5,
        onBasePercentage: 0.5,
        rbi: 1
      });
    });
    it("should not count games they didn't play in", () => {
      const originalPlayers = [...game1.away.team.players];
      const tp = game1.away.team.players[0];
      const p = tp.player;
      const i = game1.newInning(1);
      game1.away.team.players.splice(0, 1);
      expect(p.battingStats([game1])).toEqual({
        games: 0,
        atBats: 0,
        hittingAverage: 0,
        onBasePercentage: 0,
        rbi: 0
      });
      game1.away.team.players = originalPlayers as typeof game1.away.team.players;
    });
  });
});