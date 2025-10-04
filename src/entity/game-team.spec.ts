import { describe, expect, it } from "vitest";
import { GameTeam } from "./game-team";
import { Team } from "./team";
import { baltimoreFederals } from "../test/fixture/team/baltimore-federals";
import { Lineup } from "./lineup";
import { TeamPlayer } from "./team-player";
import { Player } from "./player";
import { ActiveRoster } from "./roster";

describe("game-team", () => {
  it("is should maintain a proper bullpen", () => {
    const team = new Team({
      city: "F",
      name: "F",
      awayColor: baltimoreFederals.awayColor,
      homeColor: baltimoreFederals.homeColor,
      players: [
        ...baltimoreFederals.players
      ]
    });
    const gameTeam = new GameTeam(
      team,
      new Lineup(
        team,
        team.players.find(p => p.position === "P")!,
        false,
      )
    );
    expect(gameTeam.bullPen().length).toBe(0);
    const original = gameTeam.team.players.slice();
    gameTeam.team.players.push(
      new TeamPlayer({
        player: new Player({ firstName: "P", lastName: "2", attributes: [] }),
        number: 99,
        activeFrom: new Date(2020, 0, 1), 
        position: "P"
      })
    );
    expect(gameTeam.bullPen().length).toBe(1);
    const reliever = gameTeam.bullPen()[0];
    expect(gameTeam.relieve(gameTeam.lineUp.positions.P, reliever)).toBe(void 0);
    expect(() => gameTeam.relieve(gameTeam.lineUp.positions.P, reliever)).toThrow("Cannot relieve with player 2 (#99, P), not in bullpen");
    gameTeam.team.players = original as unknown as ActiveRoster;
  });
})