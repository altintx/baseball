import { Team } from "../../../entity/team";
import { UniformColor } from "../../../entity/uniform-color";

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
});
