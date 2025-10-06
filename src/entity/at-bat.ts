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
  field: Field;

  balls: number;
  strikes: number;
  rbi: number;

  constructor(p: { batter: TeamPlayer, pitcher: TeamPlayer, balls: number, strikes: number, field: Field }) {
    this.batter = p.batter;
    this.pitcher = p.pitcher;
    this.outcome = null;
    this.pitches = [];
    this.balls = p.balls ?? 0;
    this.strikes = p.strikes ?? 0;
    this.rbi = 0;
    this.field = p.field;
  }

  simulate(game: Game, inning: Inning): AtBat {
    const field = inning.field();
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
        game.logger.log("quiet",`  ${this.pitcher.player.lastName} is attempting to pick off ${field.onBase["1B"]!.player.lastName} at first!`);
        const pickoffSuccessChance = (this.pitcher.player.playerAttributes().Intelligence * 0.7 + this.pitcher.player.playerAttributes().Dexterity * 0.3) / 300;
        const runnerJumpingAbility = (field.onBase["1B"]!.player.playerAttributes().Dexterity * 0.6 + field.onBase["1B"]!.player.playerAttributes().Intelligence * 0.4) / 300;
        if(Math.random() < pickoffSuccessChance - runnerJumpingAbility) {
          game.logger.log("quiet",`   ${field.onBase["1B"]!.player.lastName} is out at first!`);
          field.onBase["1B"] = null;
          field.fielders.P.awardExperience(10, game);
          offensiveInning.outs++;
        } else if (/* slight chance the runner tries to steal */ Math.random() < 0.1) {
          game.logger.log("verbose",`   ${field.onBase["1B"]!.player.lastName} is trying to steal second on the pickoff attempt!`);
          runnerOnFirstWillTryToStealSecond = true;
        } else {
          game.logger.log("quiet",`   ${this.pitcher.player.lastName} fails to pick off ${field.onBase["1B"]!.player.lastName}, who's still on first`);
        }
      }
      if(offensiveInning.outs === 3) {
        return this;
      }
      if(pitcherWillTryToPickOffAtThird) {
        game.logger.log("quiet",`  ${this.pitcher.player.lastName} is attempting to pick off ${field.onBase["3B"]!.player.lastName} at third!`);
        const pickoffSuccessChance = (this.pitcher.player.playerAttributes().Intelligence * 0.7 + this.pitcher.player.playerAttributes().Dexterity * 0.3) / 300;
        const runnerJumpingAbility = (field.onBase["3B"]!.player.playerAttributes().Dexterity * 0.6 + field.onBase["3B"]!.player.playerAttributes().Intelligence * 0.4) / 300;
        if(Math.random() < pickoffSuccessChance - runnerJumpingAbility) {
          game.logger.log("quiet",`   ${field.onBase["3B"]!.player.lastName} is out at third!`);
          field.onBase["3B"] = null;
          field.fielders.P.awardExperience(10, game);
          offensiveInning.outs++;
        } else {
          game.logger.log("quiet",`   ${this.pitcher.player.lastName} fails to pick off ${field.onBase["3B"]!.player.lastName}, who's still on third`);
        }
      }
      if(offensiveInning.outs === 3) {
        return this;
      }
    }
    const stealBeingAttempted = runnerOnThirdWillTryToStealHome || runnerOnSecondWillTryToStealThird || runnerOnFirstWillTryToStealSecond;
    
    if(stealBeingAttempted) {
      if(runnerOnThirdWillTryToStealHome) {
        game.logger.log("quiet",`  ${field.onBase["3B"]!.player.lastName} is trying to steal home!`);
        const stealSuccessChance = (field.onBase["3B"]!.player.playerAttributes().Dexterity * 0.6 + field.onBase["3B"]!.player.playerAttributes().Intelligence * 0.4) / 200;
        const catcherThrowingAbility = (this.pitcher.player.playerAttributes().Intelligence * 0.3 + field.fielders["C"].player.playerAttributes().Dexterity * 0.7) / 200;
        if(Math.random() < stealSuccessChance - catcherThrowingAbility) {
          game.logger.log("quiet",`   ${field.onBase["3B"]!.player.lastName} stole home!`);
          offensiveInning.runs++;
          field.onBase["3B"]!.awardExperience(30, game);
          field.onBase["3B"] = null;  
        } else {
          game.logger.log("quiet",`   ${field.onBase["3B"]!.player.lastName} is tagged out!`);
          field.onBase["3B"] = null;
          field.fielders.C.awardExperience(20, game);
          field.fielders.P.awardExperience(20, game);
          offensiveInning.outs++;
        }
      }
      if(offensiveInning.outs === 3) {
        return this;
      }
      if(runnerOnSecondWillTryToStealThird) {
        game.logger.log("quiet",`  ${field.onBase["2B"]!.player.lastName} is stealing third!`);
        const stealSuccessChance = (field.onBase["2B"]!.player.playerAttributes().Dexterity * 0.6 + field.onBase["2B"]!.player.playerAttributes().Intelligence * 0.4) / 200;
        const catcherThrowingAbility = (this.pitcher.player.playerAttributes().Intelligence * 0.3 + field.fielders["C"].player.playerAttributes().Dexterity * 0.7) / 200;
        if(Math.random() < stealSuccessChance - catcherThrowingAbility) {
          game.logger.log("quiet",`   ${field.onBase["2B"]!.player.lastName} stole third!`);
          field.onBase["2B"]!.awardExperience(10, game);
          field.onBase["3B"] = field.onBase["2B"];
          field.onBase["2B"] = null;  
        } else {
          game.logger.log("quiet",`   ${field.onBase["2B"]!.player.lastName} is tagged out!`);
          field.onBase["2B"] = null;
          field.fielders.P.awardExperience(15, game);
          offensiveInning.outs++;
        }
      }
      if(offensiveInning.outs === 3) {
        return this;
      }
      if(runnerOnFirstWillTryToStealSecond) {
        game.logger.log("quiet",`  ${field.onBase["1B"]!.player.lastName} is going to steal second!`);
        const stealSuccessChance = (field.onBase["1B"]!.player.playerAttributes().Dexterity * 0.6 + field.onBase["1B"]!.player.playerAttributes().Intelligence * 0.4) / 200;
        const catcherThrowingAbility = (this.pitcher.player.playerAttributes().Intelligence * 0.3 + field.fielders["C"].player.playerAttributes().Dexterity * 0.7) / 300; // pitcher had to throw to catcher, which takes a second and makes the out harder
        if(Math.random() < stealSuccessChance - catcherThrowingAbility) {
          game.logger.log("quiet",`   ${field.onBase["1B"]!.player.lastName} stole second!`);
          field.onBase["1B"]!.awardExperience(10, game);
          field.onBase["2B"] = field.onBase["1B"];
          field.onBase["1B"] = null;  
        } else {
          game.logger.log("quiet",`   ${field.onBase["1B"]!.player.lastName} was caught. Out!`);
          field.onBase["1B"] = null;
          field.fielders.C.awardExperience(15, game);
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
    game.logger.log("normal",`  ${this.pitcher.player.lastName} pitches to ${this.batter.player.lastName}`);
    const pitchResult = pitch.simulate();
    game.logger.log("debug",`   Pitch accuracy ${pitchResult}`);
    const batterSwings = this.batter.player.will("swing", { game, atBat: this, inning, me: this.batter, pitcher: this.pitcher.player, catcher: field.fielders.C.player, pitch });
        
    switch (true) {
      case pitchResult === "OutOfZone" && !batterSwings:
        this.balls++;
        if(this.balls >= 4) {
          game.logger.log("normal",`   ${this.batter.player.lastName} walks to first base.`);
          this.outcome = "Walk";
          field.advanceRunners("1B", this.batter, offensiveInning);
        }
        return this;
      case pitchResult === "InZone" && !batterSwings:
        this.strikes++;
        if(this.strikes >= 3) {
          game.logger.log("normal", `   ${this.batter.player.lastName} strikes out!`);
          this.outcome = "Out";
          offensiveInning.outs++;
        }
        
        return this;
      case batterSwings:
        // Determine if it's a hit or an strike (or an out)
        const batterRolls = {
          // dexterity: this.batter.player.roll("Dexterity", 4, { buff: -2 }),
          strength: this.batter.player.roll("Strength", 4, { buff: -2 }),
        },
        pitcherRolls = {
          dexterity: this.pitcher.player.roll("Dexterity", 4, { buff: -2 }),
          // intelligence: this.pitcher.player.roll("Intelligence", 4, { buff: -2 }),
        };
        const batterContact = this.batter.player.roll("Intelligence", 12, { buff: batterRolls.strength - 1}),
          pitcherDefense = this.pitcher.player.roll("Intelligence", 20, { buff: pitcherRolls.dexterity - 1});
        // Chance of making contact is based on batter's dexterity vs pitcher's dexterity and intelligence
        const swingConnectsBuff = pitchResult === "InZone" ? 1 : -1;
        const hitQuality = batterContact / 20;
        const achievedHit = (batterContact + swingConnectsBuff) > pitcherDefense;
        if(achievedHit && hitQuality > 0.9) {
          game.logger.log("quiet",`   ${this.batter.player.lastName}! Is! Going! All! The! Way!`);
          this.outcome = "Hit";
          field.advanceRunners("H", this.batter, offensiveInning);
          this.batter.awardExperience(50, game);
        } else if (achievedHit && hitQuality > 0.8) {
          game.logger.log("quiet",`   ${this.batter.player.lastName} takes a trip to third!`);
          this.outcome = "Hit";
          field.advanceRunners("3B", this.batter, offensiveInning);
        } else if (achievedHit && hitQuality > 0.7) {
          game.logger.log("quiet",`   ${this.batter.player.lastName} pays bills with a double!`);
          this.outcome = "Hit";
          field.advanceRunners("2B", this.batter, offensiveInning);
        } else if (achievedHit && hitQuality > 0.4) {
          game.logger.log("quiet",`   ${this.batter.player.lastName}: Base hit!`);
          this.outcome = "Hit";
          field.advanceRunners("1B", this.batter, offensiveInning);
        } else {
          game.logger.log("quiet",`   ${this.batter.player.lastName} swings and misses!`);
          this.strikes++;
          if(this.strikes >= 3) {
            game.logger.log("normal", `   ${this.batter.player.lastName} strikes out!`);
            this.outcome = "Out";
            offensiveInning.outs++;
          }
        }
        return this;
    }
    return this;
  }
}