import { Player } from "../../../entity/player";

export const p20 = new Player({
  firstName: "Max",
  lastName: "Power",
  attributes: [{
    type: "Strength",
    value: 9
  },{
    type: "Dexterity",
    value: 9
  },{
    type: "Constitution",
    value: 9
  },{
    type: "Wisdom",
    value: 9
  },{
    type: "Intelligence",
    value: 9
  },{
    type: "Charisma",
    value: 9
  }],
  broadPosition: "infielder"
})