import { Color } from "./color";

export class UniformColor {
  name: string;
  primaryColor: Color;
  detailColor: Color;

  constructor(attributes: {
    name: string;
    primaryColor: Color;
    detailColor: Color;
  }) {
    this.name = attributes.name;
    this.primaryColor = attributes.primaryColor;
    this.detailColor = attributes.detailColor;
  }

}