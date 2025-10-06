import { renderFieldAsText } from "./components/field";
import { renderScoreBoardAsText } from "./components/score-board";
import { AtBat } from "./entity/at-bat";
import { Game } from "./entity/game";
import { Team } from "./entity/team";
import { baltimoreFederals } from "./test/fixture/team/baltimore-federals";
import { cheyenneBaldEagles } from "./test/fixture/team/cheyenne-bald-eagles";

const teams: Team[] = [baltimoreFederals, cheyenneBaldEagles];
for (const team of teams) {
  console.log(`${team.city} ${team.name} Roster:`);
  for (const tp of team.players) {
    const a = tp.player.playerAttributes();
    console.log(`- #${tp.number} ${tp.player.lastName}, ${tp.player.firstName} (${tp.position}, ${tp.player.battingSide('brief')}) STR ${a.Strength} INT ${a.Intelligence} DEX ${a.Dexterity} CHA ${a.Charisma} CON ${a.Constitution} WIS ${a.Wisdom}`);
  }
}

const game = new Game(teams[0], teams[1], new Date(), 'none');
game.logger.log('quiet', `Simulating game between ${game.away.team.city} ${game.away.team.name} (away) and ${game.home.team.city} ${game.home.team.name} (home) on ${game.date.toDateString()}`);
game.on("inningChange", (_inning) => {
  console.log(renderScoreBoardAsText(game));
});
game.on("atBat", (atBat: AtBat) => {
  console.log(renderFieldAsText(atBat.field))
});
game.on("atBatResult", (atBat: AtBat, result) => {
  if(result.outcome) {
    if(result.outcome === "Hit" && atBat.hitType) {
      console.log(`At bat result: ${result.outcome} (${atBat.hitType})`);
    } else {
      console.log(`At bat result: ${result.outcome}`);
    }
  }
});
const outcome = game.simulate();
console.log(renderScoreBoardAsText(game));
console.log(`${outcome.winner?.name ?? "No one"} won!`);