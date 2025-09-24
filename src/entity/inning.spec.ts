import { describe, expect, it } from "vitest";
import { Inning } from "./inning";

describe("Inning", () => {
  it("should create an inning", () => {
    const i = new Inning(1);
    expect(i.number).toBe(1);
    expect(i.state).toBe("Top");
    expect(i.outcomes.home).toBeNull();
    expect(i.outcomes.away).toBeNull();
  });

  it("should return the offensive outcome for the current state", () => {
    const i = new Inning(1);
    const top = i.offensive();
    expect(top.runs).toBe(0);
    expect(top.outs).toBe(0);
    expect(top.atBats).toEqual([]);
    expect(i.outcomes.away).toBe(top);
    expect(i.outcomes.home).toBeNull();
    
    i.state = "Bottom";
    const bottom = i.offensive();
    expect(bottom.runs).toBe(0);
    expect(bottom.outs).toBe(0);
    expect(bottom.atBats).toEqual([]);
    expect(i.outcomes.home).toBe(bottom);
    expect(i.outcomes.away).toBe(top);
  });
});
