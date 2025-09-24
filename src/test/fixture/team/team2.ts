import { Team } from "../../../entity/team";
import { UniformColor } from "../../../entity/uniform-color";
import { BattyMcBatterson } from "../team-player/batty-mcbatterson";
import { PitchfordMcPitcherson } from "../team-player/pitchford-mcpitcherson";

export const Team2 = new Team({
  name: "Pigeons",
  city: "Washington D.C.",
  homeColor: [
    new UniformColor({ name: "Blue and White", primaryColor: "#1E90FF", detailColor: "#FFFFFF" }),
    new UniformColor({ name: "Gray and Blue", primaryColor: "#C4CED4", detailColor: "#1E90FF" }),
  ],
  awayColor: [
    new UniformColor({ name: "Gray and Blue", primaryColor: "#C4CED4", detailColor: "#1E90FF" }),
    new UniformColor({ name: "Blue and White", primaryColor: "#1E90FF", detailColor: "#FFFFFF" }),
  ],
});
Team2.players.push(BattyMcBatterson);
Team2.players.push(PitchfordMcPitcherson);
