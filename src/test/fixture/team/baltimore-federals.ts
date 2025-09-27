import { Team } from "../../../entity/team";
import { UniformColor } from "../../../entity/uniform-color";

export const baltimoreFederals = new Team({
  name: "Federals",
  city: "Baltimore",
  homeColor: [new UniformColor({
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
});
