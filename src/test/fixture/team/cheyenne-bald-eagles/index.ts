import { Team } from "../../../../entity/team";
import { UniformColor } from "../../../../entity/uniform-color";
import { cheyenneBaldEaglesTeamPlayerCatcher } from "./team-players/catcher";
import { cheyenneBaldEaglesTeamPlayerCenterFielder } from "./team-players/center-fielder";
import { cheyenneBaldEaglesTeamPlayerFirstBaseman } from "./team-players/first-base";
import { cheyenneBaldEaglesTeamPlayerLeftFielder } from "./team-players/left-fielder";
import { cheyenneBaldEaglesTeamPlayerStartingPitcher } from "./team-players/pitcher";
import { cheyenneBaldEaglesTeamPlayerRightFielder } from "./team-players/right-fielder";
import { cheyenneBaldEaglesTeamPlayerSecondBaseman } from "./team-players/second-base";
import { cheyenneBaldEaglesTeamPlayerShortStop } from "./team-players/short-stop";
import { cheyenneBaldEaglesTeamPlayerThirdBaseman } from "./team-players/third-base";

export const cheyenneBaldEagles = new Team({
  name: "Bald Eagles",
  city: "Cheyenne",
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
  players: [
    cheyenneBaldEaglesTeamPlayerCatcher,
    cheyenneBaldEaglesTeamPlayerFirstBaseman,
    cheyenneBaldEaglesTeamPlayerSecondBaseman,
    cheyenneBaldEaglesTeamPlayerShortStop,
    cheyenneBaldEaglesTeamPlayerThirdBaseman,
    cheyenneBaldEaglesTeamPlayerLeftFielder,
    cheyenneBaldEaglesTeamPlayerCenterFielder,
    cheyenneBaldEaglesTeamPlayerRightFielder,
    cheyenneBaldEaglesTeamPlayerStartingPitcher,
  ]
});
