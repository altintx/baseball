import { Team } from "../../../../entity/team";
import { UniformColor } from "../../../../entity/uniform-color";
import { baltimoreFederalsTeamPlayerCatcher } from "./team-players/catcher";
import { baltimoreFederalsTeamPlayerCenterFielder } from "./team-players/center-fielder";
import { baltimoreFederalsTeamPlayerFirstBaseman } from "./team-players/first-base";
import { baltimoreFederalsTeamPlayerLeftFielder } from "./team-players/left-fielder";
import { baltimoreFederalsTeamPlayerStartingPitcher } from "./team-players/pitcher";
import { baltimoreFederalsTeamPlayerRightFielder } from "./team-players/right-fielder";
import { baltimoreFederalsTeamPlayerSecondBaseman } from "./team-players/second-base";
import { baltimoreFederalsTeamPlayerShortStop } from "./team-players/short-stop";
import { baltimoreFederalsTeamPlayerThirdBaseman } from "./team-players/third-base";

export const baltimoreFederals = new Team({
  name: "Federals",
  city: "Baltimore",
  homeColor: [
    new UniformColor({
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
  players: [
    baltimoreFederalsTeamPlayerCatcher,
    baltimoreFederalsTeamPlayerFirstBaseman,
    baltimoreFederalsTeamPlayerSecondBaseman,
    baltimoreFederalsTeamPlayerShortStop,
    baltimoreFederalsTeamPlayerThirdBaseman,
    baltimoreFederalsTeamPlayerLeftFielder,
    baltimoreFederalsTeamPlayerRightFielder,
    baltimoreFederalsTeamPlayerCenterFielder,
    baltimoreFederalsTeamPlayerStartingPitcher,
  ]
});
