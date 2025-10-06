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

const game = new Game(teams[0], teams[1], new Date(), 'quiet');
game.logger.log('quiet', `Simulating game between ${game.away.team.city} ${game.away.team.name} (away) and ${game.home.team.city} ${game.home.team.name} (home) on ${game.date.toDateString()}`);
game.on("inningChange", (_inning) => {
  game.logger.log('quiet', renderScoreBoardAsText(game));
});
game.on("atBat", (atBat: AtBat) => {
  game.logger.log("quiet", renderFieldAsText(atBat.field))
});
game.on("atBatResult", (atBat: AtBat, result) => {
  if(result.outcome) {
    game.logger.log("quiet", `At bat result: ${result.outcome}`);
  }
});
const outcome = game.simulate();
game.logger.log('quiet', renderScoreBoardAsText(game));
game.logger.log('quiet', `${outcome.winner?.name ?? "No one"} won!`);