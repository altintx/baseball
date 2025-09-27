import { TeamPlayer } from "../../../../../entity/team-player";
import { p09 } from "../../../player/p09";

export const baltimoreFederalsTeamPlayerCatcher = new TeamPlayer({
  player: p09,
  position: "C",
  number: 9,
  activeFrom: new Date(2020, 0, 1),
  activeTo: null
})