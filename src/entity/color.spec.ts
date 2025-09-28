import { describe, expect, it } from "vitest";
import { isColor } from "./color";

describe("isColor", () => {
  it("should accept a 24 bit hex color", () => {
    expect(isColor("#FFFFFF")).toBe(true);
    expect(isColor("#000000")).toBe(true);
    expect(isColor("#123456")).toBe(true);
    expect(isColor("#abcdef")).toBe(true);
    expect(isColor("#ABCDEF")).toBe(true);
  });

  it("should reject invalid colors", () => {
    expect(isColor("FFFFFF")).toBe(false); // missing #
    expect(isColor("#FFF")).toBe(false); // too short
    expect(isColor("#FFFFF")).toBe(false); // too short
    expect(isColor("#FFFFFFF")).toBe(false); // too long
    expect(isColor("#GGGGGG")).toBe(false); // invalid hex
    expect(isColor("#12345G")).toBe(false); // invalid hex
    expect(isColor("")).toBe(false); // empty string
    expect(isColor("#1234")).toBe(false); // too short
  });
})