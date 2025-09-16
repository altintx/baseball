import { Field } from "./field";
import { Game } from "./game";
import { Inning } from "./inning";
import { Pitch, PitchType } from "./pitch";
import { TeamPlayer } from "./team-player";

type AtBatOutcome = "Hit" | "Walk" | "Out" | "Error";

export class AtBat {
  batter: TeamPlayer;
  pitcher: TeamPlayer
  outcome: AtBatOutcome | null;
  pitches: Pitch[];

  balls: number;
  strikes: number;

  constructor(batter: TeamPlayer, pitcher: TeamPlayer, balls?: number, strikes?: number) {
    this.batter = batter;
    this.pitcher = pitcher;
    this.outcome = null;
    this.pitches = [];
    this.balls = balls ?? 0;
    this.strikes = strikes ?? 0;
  }

  simulate(field: Field, game: Game, inning: Inning): AtBat {
    // what can happen? 
    // a player on base may try to steal a base
    // a pitcher may throw to a base to try to pick off a runner
    // a pitch is thrown
    // the batter may swing or not swing
    // if the batter swings, they may make contact or not
    // if they make contact, it may be a hit or an out (or error)
    // if they don't make contact, it's a strike
    // if they don't swing, it's a ball or strike depending on the pitch location
    const offensiveInning = inning.offensive();

    // what influences a runner trying to steal a base?
    // speed, intelligence, current inning, score, number of outs, pitcher's pickoff ability, catcher's arm strength and accuracy
    let runnerOnThirdWillTryToStealHome = field.onBase["3B"] && Math.random() < (field.onBase["3B"]!.player.playerAttributes().Dexterity / 200);
    let runnerOnSecondWillTryToStealThird = field.onBase["2B"] && !field.onBase["3B"] && Math.random() < (field.onBase["2B"]!.player.playerAttributes().Dexterity / 200);
    let runnerOnFirstWillTryToStealSecond = field.onBase["1B"] && !field.onBase["2B"] && Math.random() < (field.onBase["1B"]!.player.playerAttributes().Dexterity / 200);
    const pitcherWillTryToPickOffAtFirst = field.onBase["1B"] && !field.onBase["2B"] && Math.random() < (this.pitcher.player.playerAttributes().Intelligence / 300);
    const pitcherWillTryToPickOffAtThird = field.onBase["3B"] && Math.random() < (this.pitcher.player.playerAttributes().Intelligence / 300);
    const pickoffBeingAttempted = pitcherWillTryToPickOffAtFirst || pitcherWillTryToPickOffAtThird;

    if(pickoffBeingAttempted) {
      if(pitcherWillTryToPickOffAtFirst) {
        console.log(`  ${this.pitcher.player.lastName} is attempting to pick off ${field.onBase["1B"]!.player.lastName} at first!`);
        const pickoffSuccessChance = (this.pitcher.player.playerAttributes().Intelligence * 0.7 + this.pitcher.player.playerAttributes().Dexterity * 0.3) / 300;
        const runnerJumpingAbility = (field.onBase["1B"]!.player.playerAttributes().Dexterity * 0.6 + field.onBase["1B"]!.player.playerAttributes().Intelligence * 0.4) / 300;
        if(Math.random() < pickoffSuccessChance - runnerJumpingAbility) {
          console.log(`   ${this.pitcher.player.lastName} successfully picks off ${field.onBase["1B"]!.player.lastName} at first!`);
          field.onBase["1B"] = null;
          field.fielders.P.awardExperience(10);
          offensiveInning.outs++;
        } else if (/* slight chance the runner tries to steal */ Math.random() < 0.1) {
          console.log(`   ${field.onBase["1B"]!.player.lastName} is trying to steal second on the pickoff attempt!`);
          runnerOnFirstWillTryToStealSecond = true;
        } else {
          console.log(`   ${this.pitcher.player.lastName} fails to pick off ${field.onBase["1B"]!.player.lastName}, who's still on first`);
        }
      }
      if(offensiveInning.outs === 3) {
        return this;
      }
      if(pitcherWillTryToPickOffAtThird) {
        console.log(`  ${this.pitcher.player.lastName} is attempting to pick off ${field.onBase["3B"]!.player.lastName} at third!`);
        const pickoffSuccessChance = (this.pitcher.player.playerAttributes().Intelligence * 0.7 + this.pitcher.player.playerAttributes().Dexterity * 0.3) / 300;
        const runnerJumpingAbility = (field.onBase["3B"]!.player.playerAttributes().Dexterity * 0.6 + field.onBase["3B"]!.player.playerAttributes().Intelligence * 0.4) / 300;
        if(Math.random() < pickoffSuccessChance - runnerJumpingAbility) {
          console.log(`   ${this.pitcher.player.lastName} successfully picks off ${field.onBase["3B"]!.player.lastName} at third!`);
          field.onBase["3B"] = null;
          field.fielders.P.awardExperience(10);
          offensiveInning.outs++;
        } else {
          console.log(`   ${this.pitcher.player.lastName} fails to pick off ${field.onBase["3B"]!.player.lastName}, who's still on third`);
        }
      }
      if(offensiveInning.outs === 3) {
        return this;
      }
    }
    const stealBeingAttempted = runnerOnThirdWillTryToStealHome || runnerOnSecondWillTryToStealThird || runnerOnFirstWillTryToStealSecond;
    
    if(stealBeingAttempted) {
      if(runnerOnThirdWillTryToStealHome) {
        console.log(`  ${field.onBase["3B"]!.player.lastName} is attempting to steal home!`);
        const stealSuccessChance = (field.onBase["3B"]!.player.playerAttributes().Dexterity * 0.6 + field.onBase["3B"]!.player.playerAttributes().Intelligence * 0.4) / 200;
        const catcherThrowingAbility = (this.pitcher.player.playerAttributes().Intelligence * 0.3 + field.fielders["C"].player.playerAttributes().Dexterity * 0.7) / 200;
        if(Math.random() < stealSuccessChance - catcherThrowingAbility) {
          console.log(`   ${field.onBase["3B"]!.player.lastName} successfully steals home!`);
          offensiveInning.runs++;
          field.onBase["3B"]!.awardExperience(30);
          field.onBase["3B"] = null;  
        } else {
          console.log(`   ${field.onBase["3B"]!.player.lastName} is thrown out trying to steal home!`);
          field.onBase["3B"] = null;
          field.fielders.C.awardExperience(20);
          field.fielders.P.awardExperience(20);
          offensiveInning.outs++;
        }
      }
      if(offensiveInning.outs === 3) {
        return this;
      }
      if(runnerOnSecondWillTryToStealThird) {
        console.log(`  ${field.onBase["2B"]!.player.lastName} is attempting to steal third!`);
        const stealSuccessChance = (field.onBase["2B"]!.player.playerAttributes().Dexterity * 0.6 + field.onBase["2B"]!.player.playerAttributes().Intelligence * 0.4) / 200;
        const catcherThrowingAbility = (this.pitcher.player.playerAttributes().Intelligence * 0.3 + field.fielders["C"].player.playerAttributes().Dexterity * 0.7) / 200;
        if(Math.random() < stealSuccessChance - catcherThrowingAbility) {
          console.log(`   ${field.onBase["2B"]!.player.lastName} successfully steals third!`);
          field.onBase["2B"]!.awardExperience(10);
          field.onBase["3B"] = field.onBase["2B"];
          field.onBase["2B"] = null;  
        } else {
          console.log(`   ${field.onBase["2B"]!.player.lastName} is thrown out trying to steal third!`);
          field.onBase["2B"] = null;
          field.fielders.P.awardExperience(15);
          offensiveInning.outs++;
        }
      }
      if(offensiveInning.outs === 3) {
        return this;
      }
      if(runnerOnFirstWillTryToStealSecond) {
        console.log(`  ${field.onBase["1B"]!.player.lastName} is attempting to steal second!`);
        const stealSuccessChance = (field.onBase["1B"]!.player.playerAttributes().Dexterity * 0.6 + field.onBase["1B"]!.player.playerAttributes().Intelligence * 0.4) / 200;
        const catcherThrowingAbility = (this.pitcher.player.playerAttributes().Intelligence * 0.3 + field.fielders["C"].player.playerAttributes().Dexterity * 0.7) / 300; // pitcher had to throw to catcher, which takes a second and makes the out harder
        if(Math.random() < stealSuccessChance - catcherThrowingAbility) {
          console.log(`   ${field.onBase["1B"]!.player.lastName} successfully steals second!`);
          field.onBase["1B"]!.awardExperience(10);
          field.onBase["2B"] = field.onBase["1B"];
          field.onBase["1B"] = null;  
        } else {
          console.log(`   ${field.onBase["1B"]!.player.lastName} is thrown out trying to steal second!`);
          field.onBase["1B"] = null;
          field.fielders.C.awardExperience(15);
          offensiveInning.outs++;
        }
      }
      if(offensiveInning.outs === 3) {
        return this;
      } 
    }
    
    // Now, the pitch
    const pitch = Pitch.randomPitch(this.pitcher.player, this.batter.player, game);
    this.pitches.push(pitch);
    console.log(`  ${this.pitcher.player.lastName} pitches to ${this.batter.player.lastName}`);
    const pitchResult = pitch.simulate();
    console.log(`   Pitch result: ${pitchResult.type}, ${pitchResult.location}`);
    switch (pitchResult.type) {
      case "Ball":
        this.balls++;
        if(this.balls >= 4) {
          console.log(`   ${this.batter.player.lastName} walks to first base.`);
          this.outcome = "Walk";
          field.advanceRunners("1B", this.batter, offensiveInning);
        }
        return this;
      case "Strike":
        this.strikes++;
        if(this.strikes >= 3) {
          console.log(`   ${this.batter.player.lastName} strikes out!`);
          this.outcome = "Out";
          offensiveInning.outs++;
          this.pitcher.awardExperience(5);
        }
        
        return this;
      case "Foul":
        if(this.strikes < 2) {
          this.strikes++;
        }
        return this;
      case "InPlay":
        // Determine if it's a hit or an out
        const batterContact = (this.batter.player.playerAttributes().Dexterity * 0.6 + this.batter.player.playerAttributes().Strength * 0.4) / 200;
        const pitcherDefense = (this.pitcher.player.playerAttributes().Dexterity * 0.4 + this.pitcher.player.playerAttributes().Intelligence * 0.6) / 200;
        const hitChance = batterContact - pitcherDefense + 0.3; // base 30% chance of hit
        const hitQuality = Math.random() + (this.batter.player.playerAttributes().Strength * 0.5 + this.batter.player.playerAttributes().Dexterity * 0.5) / 200;
        const achievedHit = Math.random() < hitChance;
        if(achievedHit && hitQuality > 0.9) {
          console.log(`   ${this.batter.player.lastName} gets a home run!`);
          this.outcome = "Hit";
          offensiveInning.runs += 1 + (field.onBase["1B"] ? 1 : 0) + (field.onBase["2B"] ? 1 : 0) + (field.onBase["3B"] ? 1 : 0);
          field.onBase["1B"] = null;
          field.onBase["2B"] = null;
          field.onBase["3B"] = null;
          this.batter.awardExperience(50);
          return this;
        } else if (achievedHit && hitQuality > 0.8) {
          console.log(`   ${this.batter.player.lastName} hits a triple!`);
          this.outcome = "Hit";
          field.advanceRunners("3B", this.batter, offensiveInning);
          this.batter.awardExperience(30);
          return this;
        } else if (achievedHit && hitQuality > 0.7) {
          console.log(`   ${this.batter.player.lastName} hits a double!`);
          this.outcome = "Hit";
          field.advanceRunners("2B", this.batter, offensiveInning);
          this.batter.awardExperience(20);
          return this;
        } else if (achievedHit && hitQuality > 0.4) {
          console.log(`   ${this.batter.player.lastName} hits a single!`);
          this.outcome = "Hit";
          field.advanceRunners("1B", this.batter, offensiveInning);
          this.batter.awardExperience(10);
          return this;
        } else {
          console.log(`   ${this.batter.player.lastName} is thrown out!`);
          this.outcome = "Out";
          offensiveInning.outs++;
          return this;
        }
    }
  }
}