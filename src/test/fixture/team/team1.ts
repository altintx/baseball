import { Team } from "../../../entity/team";
import { UniformColor } from "../../../entity/uniform-color";
import { BattyMcBatterson } from "../team-player/batty-mcbatterson";
import { PitchfordMcPitcherson } from "../team-player/pitchford-mcpitcherson";

export const Team1 = new Team({
  name: "Federals",
  city: "Baltimore",
  homeColor: [new UniformColor({ name: "Navy and White", primaryColor: "#0033A0", detailColor: "#FFFFFF" }), new UniformColor({ name: "Gray and Navy", primaryColor: "#C4CED4", detailColor: "#0033A0" })],
  awayColor: [new UniformColor({ name: "Gray and Navy", primaryColor: "#C4CED4", detailColor: "#0033A0" }), new UniformColor({ name: "Navy and White", primaryColor: "#0033A0", detailColor: "#FFFFFF" })],
});

Team1.players.push(BattyMcBatterson);
Team1.players.push(PitchfordMcPitcherson);
