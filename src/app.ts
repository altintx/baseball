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
import { baltimoreFederals } from "./test/fixture/team/baltimore-federals";
import { cheyenneBaldEagles } from "./test/fixture/team/cheyenne-bald-eagles";

const teams: Team[] = [baltimoreFederals, cheyenneBaldEagles];
for (const team of teams) {
  for (let i = 0; i < 25; i++) {
    const player = Player.generate(i / 25, "USA", "male")
    const teamPlayer = new TeamPlayer({
      player,
      number: i + 1,
      position: i < 9? PlayerPositions[i]: "P",
      activeFrom: new Date("2023-04-01"),
    });
    team.players.push(teamPlayer);
    let availablePoints = 13;
    while (availablePoints > 0) {
      const value = Math.random() > 0.2 ? 1: -1;
      const type = PlayerAttributeBuckets[(PlayerAttributeBuckets.length * Math.random()) | 0];
      const attribute = new PlayerAttributePoint({ type, value });
      // Assign attribute to player
      player.proficencies.push(attribute);
      availablePoints -= value;
    }
  }
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