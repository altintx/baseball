import { describe, expect, it } from "vitest";
import { game1 } from "../test/fixture/game/game1";
import { AtBat } from "./at-bat";
import { Game } from "./game";
import { baltimoreFederals } from "../test/fixture/team/baltimore-federals";
import { cheyenneBaldEagles } from "../test/fixture/team/cheyenne-bald-eagles";
import { Inning } from "./inning";

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
  });
  it("should send a game to the bottom of the ninth when the home team pulls ahead in the top of the ninth", () => {
    const g = new Game(
      baltimoreFederals,
      cheyenneBaldEagles,
      new Date(2024, 2, 15, 19, 0),
    );
    g.innings = [
      new Inning(1, g),
      new Inning(2, g),
      new Inning(3, g),
      new Inning(4, g),
      new Inning(5, g),
      new Inning(6, g),
      new Inning(7, g),
      new Inning(8, g),
      new Inning(9, g),
    ];
    g.innings[0].outcomes = { away: { runs: 0, outs: 3, atBats: [] }, home: { runs: 0, outs: 3, atBats: [] } };
    g.innings[1].outcomes = { away: { runs: 0, outs: 3, atBats: [] }, home: { runs: 0, outs: 3, atBats: [] } };
    g.innings[2].outcomes = { away: { runs: 0, outs: 3, atBats: [] }, home: { runs: 0, outs: 3, atBats: [] } };
    g.innings[3].outcomes = { away: { runs: 0, outs: 3, atBats: [] }, home: { runs: 0, outs: 3, atBats: [] } };
    g.innings[4].outcomes = { away: { runs: 0, outs: 3, atBats: [] }, home: { runs: 0, outs: 3, atBats: [] } };
    g.innings[5].outcomes = { away: { runs: 0, outs: 3, atBats: [] }, home: { runs: 3, outs: 3, atBats: [] } };
    g.innings[6].outcomes = { away: { runs: 0, outs: 3, atBats: [] }, home: { runs: 0, outs: 3, atBats: [] } };
    g.innings[7].outcomes = { away: { runs: 1, outs: 3, atBats: [] }, home: { runs: 0, outs: 3, atBats: [] } };
    g.innings[8].outcomes = { away: { runs: 3, outs: 3, atBats: [] }, home: null };
    expect(g.runs("away")).toBe(4);
    expect(g.runs("home")).toBe(3);
    expect(g.winnerTeam({ inningState: "Bottom", outs: 0 })).toBe(null);
    expect(g.winnerTeam({ inningState: "Bottom", outs: 3 })).toBe(g.away.team);
  })
})