import { Player } from "../../../entity/player";

export const p08 = new Player({
  firstName: "Fluffy",
  lastName: "McDougal",
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