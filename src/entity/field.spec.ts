import { describe, expect, it } from "vitest";
import { Field } from "./field";
import { game1 } from "../test/fixture/game/game1";
import { Inning } from "./inning";
import { TeamPlayer } from "./team-player";

describe("field", () => {
  it("should put a guy on first with a single", () => {
    const offense = game1.away;
    const defense = game1.home;
    const f = new Field(defense.lineUp.positions, game1);
    const inning = new Inning(1);
    const batter = offense.lineUp.positions[offense.lineUp.battingOrder[0]];
    expect(batter).toBeInstanceOf(TeamPlayer);
    const outcome = inning.offensive();
    f.onBase.H = batter;
    f.advanceRunners("1B", batter, outcome);
    expect(f.onBase["1B"]).toBe(batter);
    expect(f.onBase["2B"]).toBe(null);
    expect(f.onBase["3B"]).toBe(null);
    expect(f.onBase.H).toBe(null);
    expect(outcome.runs).toBe(0);
    expect(outcome.outs).toBe(0);
  });
  it("should identify the base a runner is on, if any", () => {
    const offense = game1.away;
    const defense = game1.home;
    const f = new Field(defense.lineUp.positions, game1);
    let p = offense.lineUp.positions[offense.lineUp.battingOrder[0]];
    expect(f.runnersBase(p)).toBe(null);
    f.onBase["1B"] = p;
    expect(f.runnersBase(p)).toBe("1B");
    f.onBase["1B"] = null;
    f.onBase["2B"] = p;
    expect(f.runnersBase(p)).toBe("2B");
    f.onBase["2B"] = null;
    f.onBase["3B"] = p;
    expect(f.runnersBase(p)).toBe("3B");
    f.onBase["3B"] = null;
    f.onBase.H = p;
    expect(f.runnersBase(p)).toBe("H");
  });
})