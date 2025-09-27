import { renderScoreBoardAsText } from "./components/score-board";
import { Country } from "./entity/country";
import { Game } from "./entity/game";
import { Gender } from "./entity/gender";
import { Player } from "./entity/player";
import { PlayerAttributeBuckets, PlayerAttributePoint } from "./entity/player-attribute-point";
import { PlayerPositions } from "./entity/player-position";
import { Team } from "./entity/team";
import { TeamPlayer } from "./entity/team-player";
import { UniformColor } from "./entity/uniform-color";
import { teamPlayers1 } from "./test/fixture/team-player/lineup1";
import { baltimoreFederals } from "./test/fixture/team/baltimore-federals";
import { cheyenneBaldEagles } from "./test/fixture/team/cheyenne-bald-eagles";

const teams: Team[] = [baltimoreFederals, cheyenneBaldEagles];
for (const team of teams) {
  team.players = teamPlayers1;
  console.log(`${team.city} ${team.name} Roster:`);
  for (const tp of team.players) {
    const a = tp.player.playerAttributes();
    console.log(`- #${tp.number} ${tp.player.lastName}, ${tp.player.firstName} (${tp.position}, ${tp.player.battingSide('brief')}) STR ${a.Strength} INT ${a.Intelligence} DEX ${a.Dexterity} CHA ${a.Charisma} CON ${a.Constitution} WIS ${a.Wisdom}`);
  }
}

const game = new Game(teams[0], teams[1], new Date(), 'quiet');
game.logger.log('quiet', `Simulating game between ${game.away.team.city} ${game.away.team.name} (away) and ${game.home.team.city} ${game.home.team.name} (home) on ${game.date.toDateString()}`);
game.on("inningChange", (inning) => {
  game.logger.log('quiet', renderScoreBoardAsText(game));
});
const outcome = game.simulate();
game.logger.log('quiet', `Final Score: ${outcome.away.team.name} ${game.runs('away')} - ${outcome.home.team.name} ${outcome.runs('home')}`);
game.logger.log('quiet', `${outcome.winner?.name ?? "No one"} won!`);