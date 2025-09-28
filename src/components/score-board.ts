import { Game } from "../entity/game";

export function renderScoreBoardAsText(game: Game): string {
  const awayTeam = game.away.team;
  const homeTeam = game.home.team;
  const playedInnings = game.innings.length;
  const gameInnings = Math.max(9, playedInnings);
  const inningBanner = Array.from({ length: gameInnings }, (_, i) => (i + 1).toString());
  const header = ["TEA", ...inningBanner, "R", "H", "E"];
  const awayLine: (string | number)[] = [awayTeam.abbreviation()];
  const homeLine: (string | number)[] = [homeTeam.abbreviation()];
  for(let inning = 0; inning < gameInnings; inning++) {
    const inningData = game.innings[inning];
    awayLine.push(inningData?.outcomes?.away?.runs.toString() ?? "");
    homeLine.push(inningData?.outcomes?.home?.runs.toString() ?? "" );
  }
  awayLine.push(game.runs('away'), game.hits('away'), game.errors('away'));
  homeLine.push(game.runs('home'), game.hits('home'), game.errors('home'));
  const lines = [
    header.map(h => h.toString().padStart(2)).join(" | "),
    "-".repeat(header.length * 5),
    awayLine.map(h => h.toString().padStart(2)).join(" | "),
    homeLine.map(h => h.toString().padStart(2)).join(" | "),
  ];
  return lines.join("\n");
}