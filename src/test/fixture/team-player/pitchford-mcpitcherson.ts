import { Player } from "../../../entity/player";
import { TeamPlayer } from "../../../entity/team-player";

const affiliateStartDate = new Date(2024, 2, 1);
export const PitchfordMcPitcherson = new TeamPlayer({
  player: new Player({
    attributes: [],
    firstName: "Pitchford",
    lastName: "McPitcherson",
    country: "USA",
    dexterity: "Right",
  }),
  position: "P",
  number: 34,
  activeFrom: affiliateStartDate,
  activeTo: null
});
