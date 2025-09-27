import { describe, expect, it } from "vitest";
import { Team } from "./team";
import { UniformColor } from "./uniform-color";
import { Player } from "./player";
import { PlayerPositions } from "./player-position";
import { TeamPlayer } from "./team-player";
import { ActiveRoster } from "./roster";

function teamFactory(city: string, name: string): Team {
  const teamPlayers = Array.from({ length: 9 }, (_, i) => {
    const p = new Player({
      firstName: "First",
      lastName: "Last",
      attributes: []
    });
    const tp = new TeamPlayer({
      player: p,
      number: i + 1,
      activeFrom: new Date(2020, 0, 1),
      activeTo: null,
      position: PlayerPositions[i % PlayerPositions.length],
    });
    return tp;
  });
  return new Team({
    name,
    city,
    homeColor: [new UniformColor({ name: "Red and White", primaryColor: "#FF0000", detailColor: "#FFFFFF" }), new UniformColor({ name: "Black and Red", primaryColor: "#000000", detailColor: "#FF0000" })],
    awayColor: [new UniformColor({ name: "White and Red", primaryColor: "#FFFFFF", detailColor: "#FF0000" }), new UniformColor({ name: "Black and Red", primaryColor: "#000000", detailColor: "#FF0000" })],
    players: teamPlayers as ActiveRoster
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