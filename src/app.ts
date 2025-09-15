import { Country } from "./entity/country";
import { Game } from "./entity/game";
import { Gender } from "./entity/gender";
import { Player } from "./entity/player";
import { PlayerAttributeBuckets, PlayerAttributePoint } from "./entity/player-attribute-point";
import { PlayerPositions } from "./entity/player-position";
import { Team } from "./entity/team";
import { TeamPlayer } from "./entity/team-player";
import { UniformColor } from "./entity/uniform-color";

const teams: Team[] = [
  new Team({
  name: "Yankees",
  city: "New York",
  homeColor: [new UniformColor({
    name: "Navy and White",
    primaryColor: "#0033A0",
    detailColor: "#FFFFFF",
  }), new UniformColor({
    name: "Gray and Navy",
    primaryColor: "#C4CED4",
    detailColor: "#0033A0",
  })
  ],
  awayColor: [new UniformColor({
    name: "Gray and Navy",
    primaryColor: "#C4CED4",
    detailColor: "#0033A0",
  }), new UniformColor({
    name: "Navy and White",
    primaryColor: "#0033A0",
    detailColor: "#FFFFFF",
  })
  ],
}),
new Team({
  name: "Red Sox",
  city: "Boston",
  homeColor: [new UniformColor({
    name: "Red and White",
    primaryColor: "#BD3039",
    detailColor: "#FFFFFF",
  }), new UniformColor({
    name: "Navy and Red",
    primaryColor: "#0C2340",
    detailColor: "#BD3039",
  })
  ],
  awayColor: [new UniformColor({
    name: "Gray and Navy",
    primaryColor: "#C4CED4",
    detailColor: "#0C2340",
  }), new UniformColor({
    name: "Navy and Red",
    primaryColor: "#0C2340",
    detailColor: "#BD3039",
  })
  ],
}),
];

console.log(teams);
for (const team of teams) {
  for (let i = 0; i < 25; i++) {
    const player = Player.generateRandomly()
    const teamPlayer = new TeamPlayer({
      player,
      number: i + 1,
      position: i < 9? PlayerPositions[i]: "P",
      activeFrom: new Date("2023-04-01"),
    });
    team.players.push(teamPlayer);
    let availablePoints = 13;
    while (availablePoints > 0) {
      const value = 3 - (Math.random() * 2) | 0;
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
    console.log(`- #${tp.number} ${tp.player.lastName}, ${tp.player.firstName} (${tp.position}, ${tp.player.battingSide('brief')}) STR ${a.Strenth} INT ${a.Intelligence} DEX ${a.Dexterity} CHA ${a.Charisma} CON ${a.Constitution} WIS ${a.Wisdom}`);
  }
}

const game = new Game(teams[0], teams[1], new Date());
console.log(`Simulating game between ${game.away.team.city} ${game.away.team.name} and ${game.home.team.city} ${game.home.team.name} on ${game.date.toDateString()}`);
const outcome = game.simulate();
console.log(`Final Score: ${game.away.team.name} ${game.runs('away')} - ${game.home.team.name} ${game.runs('home')}`);
console.log(`${game.winner?.name ?? "No one"} won!`);