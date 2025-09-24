import { Player } from "../../../entity/player"
import { TeamPlayer } from "../../../entity/team-player"

const affiliateStartDate = new Date(2024, 2, 1);
export const BattyMcBatterson = new TeamPlayer({
  player: new Player({
    attributes: [],
    firstName: "Batter",
    lastName: "McBatterson",
    country: "USA",
    dexterity: "Right",
    gender: "male"
  }),
  position: "DH",
  number: 12,
  activeFrom: affiliateStartDate,
  activeTo: null
});
