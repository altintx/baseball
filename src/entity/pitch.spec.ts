import { describe, expect, it } from 'vitest'
import { Pitch } from './pitch'
import { PitchfordMcPitcherson } from '../test/fixture/team-player/pitchford-mcpitcherson'
import { BattyMcBatterson } from '../test/fixture/team-player/batty-mcbatterson'
import { game1 } from '../test/fixture/game/game1'

describe("Pitch", () => {
  it("should deliver a random pitch", () => {
    const homePitcher = game1.home.lineUp.positions.P;
    const leadOffAwayBatter = game1.away.lineUp.positions[game1.away.lineUp.battingOrder[0]];
    const pitch = Pitch.randomPitch(homePitcher.player, leadOffAwayBatter.player, game1);
    expect(pitch.batter).toBe(leadOffAwayBatter.player);
    expect(pitch.pitcher).toBe(homePitcher.player);
    expect(pitch.game).toBe(game1);
    expect(pitch.speed).toBeGreaterThan(50);
    expect(pitch.spinRate).not.toBe(0);
    expect(pitch.type).toBeOneOf(["Fastball", "Curveball", "Slider", "Changeup", "Sinker", "Cutter", "Knuckleball"]);
  })
})