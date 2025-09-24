import { describe, expect, it } from 'vitest'
import { Pitch } from './pitch'
import { PitchfordMcPitcherson } from '../test/fixture/team-player/pitchford-mcpitcherson'
import { BattyMcBatterson } from '../test/fixture/team-player/batty-mcbatterson'
import { game1 } from '../test/fixture/game/game1'

describe("Pitch", () => {
  it("should deliver a random pitch", () => {
    const pitch = Pitch.randomPitch(PitchfordMcPitcherson.player, BattyMcBatterson.player, game1);
    expect(pitch.batter).toBe(BattyMcBatterson.player);
    expect(pitch.pitcher).toBe(PitchfordMcPitcherson.player);
    expect(pitch.game).toBe(game1);
    expect(pitch.speed).toBeGreaterThan(50);
    expect(pitch.spinRate).not.toBe(0);
    expect(pitch.type).toBeOneOf(["Fastball", "Curveball", "Slider", "Changeup", "Sinker", "Cutter", "Splitter", "Knuckleball"]);
  })
})