import { describe, expect, it } from "vitest";
import { game1 } from "../test/fixture/game/game1";
import { AtBat } from "./at-bat";

describe("game", () => {
  it("should track runs", () => {
    const g = game1;
    expect(g.runs("home")).toBe(0);
    expect(g.runs("away")).toBe(0);
    const inning1 = g.newInning(1);
    g.innings.push(inning1);
    expect(g.runs("home")).toBe(0);
    expect(g.runs("away")).toBe(0);
    inning1.offensive().atBats.push(new AtBat({
      batter: game1.away.lineUp.positions[game1.away.lineUp.battingOrder[0]],
      pitcher: game1.home.lineUp.positions.P,
      field: inning1.field(),
      balls: 0,
      strikes: 0
    }))
  })
})