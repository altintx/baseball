import { describe, expect, it } from "vitest";
import { Team } from "./team";
import { UniformColor } from "./uniform-color";

function teamFactory(city: string, name: string): Team {
  return new Team({
    name,
    city,
    homeColor: [new UniformColor({ name: "Red and White", primaryColor: "#FF0000", detailColor: "#FFFFFF" }), new UniformColor({ name: "Black and Red", primaryColor: "#000000", detailColor: "#FF0000" })],
    awayColor: [new UniformColor({ name: "White and Red", primaryColor: "#FFFFFF", detailColor: "#FF0000" }), new UniformColor({ name: "Black and Red", primaryColor: "#000000", detailColor: "#FF0000" })],
  });
}
describe("Team", () => {
  it("should abbreviate the name properly", () => {
    expect(teamFactory("San Francisco", "Gold Miners").abbreviation()).toBe("SGM");
    expect(teamFactory("Baltimore", "Federals").abbreviation()).toBe("BAF");
    expect(teamFactory("Albany", "Albacores").abbreviation()).toBe("ALA");
    expect(teamFactory("C 1", "T 2").abbreviation()).toBe("CT2");
    expect(teamFactory("C 1 2", "T 2").abbreviation()).toBe("CT2");
    expect(teamFactory("C", "T 2").abbreviation()).toBe("CT2");
    expect(teamFactory("C", "T").abbreviation()).toBe("CT");
    expect(teamFactory("C 1", "T").abbreviation()).toBe("C1T");
    expect(teamFactory("C 1 2", "T").abbreviation()).toBe("C1T");

  });
})