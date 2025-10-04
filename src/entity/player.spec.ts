import { describe, expect, it } from "vitest";
import { p01 } from "../test/fixture/player/p01";
import { game1 } from "../test/fixture/game/game1";

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
});