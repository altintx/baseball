import { playerStatsToText } from "./components/stat-line";
import { Cities } from "./entity/city";
import { Countries } from "./entity/country";
import { Genders } from "./entity/gender";
import { BroadPositions, Player } from "./entity/player";
import { Season } from "./entity/season";
import { Team, TeamNames } from "./entity/team";

const PlayerPool: Player[] = [];
for(let i = 0; i < 70000; i++) {
  PlayerPool.push(Player.generate(Math.random(), Countries[Math.floor(Countries.length * Math.random())], Genders[Math.floor(Genders.length * Math.random())], BroadPositions[Math.floor(BroadPositions.length * Math.random())]));
}

const teams: Team[] = [];
for(let i = 0; i < 28; i++) {
  const country = ["USA", "Canada", "Mexico"][Math.floor(Math.random() * 3)] as "USA" | "Canada" | "Mexico";
  const city = Cities[country][Math.floor(Math.random() * Cities[country].length)];
  const name = TeamNames[Math.floor(Math.random() * TeamNames.length)];
  teams.push(Team.assembleNewTeam(PlayerPool, city, name, new Date()));
}

for(const team of teams) {
  console.log(`Team: ${team.name}, City: ${team.city}, Players: ${team.players.length}`);
  for (const tp of team.players) {
    console.log(playerStatsToText(tp));
  }
}
const apr1ThisYear = new Date(new Date().getFullYear(), 3, 1);
const oct1ThisYear = new Date(new Date().getFullYear(), 9, 1);
const season = new Season(teams, apr1ThisYear, oct1ThisYear, 162);
season.scheduleGames({ repeatsPerPair: 4, daysBetweenSeries: 1 });
console.log(`Scheduled ${season.schedule.length} games for ${teams.length} teams in the ${season.year} season.`);
// for(const game of season.schedule) {
//   console.log(`${game.date.toDateString()}: ${game.away.team.city} ${game.away.team.name} at ${game.home.team.city} ${game.home.team.name}`);
//}
const particularTeam = teams[0]!;
for(const game of season.schedule.filter(g => g.home.team === particularTeam || g.away.team === particularTeam)) {
  console.log(`${game.date.toDateString()} ${game.date.toTimeString()}: ${game.away.team.city} ${game.away.team.name} at ${game.home.team.city} ${game.home.team.name}`);
}