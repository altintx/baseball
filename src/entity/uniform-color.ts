import { Color } from "./color";

export class UniformColor {
  name: string;
  primaryColor: Color;
  detailColor: Color;

  constructor(attributes: {
    name: string;
    primaryColor: Color | { r: number; g: number; b: number };
    detailColor: Color | { r: number; g: number; b: number };
  }) {
    this.name = attributes.name;
    this.primaryColor = typeof attributes.primaryColor === "string" ? attributes.primaryColor : UniformColor.rgbToHex(attributes.primaryColor);
    this.detailColor = typeof attributes.detailColor === "string" ? attributes.detailColor : UniformColor.rgbToHex(attributes.detailColor);
  }

  static rgbToHex(rgb: { r: number; g: number; b: number }): Color {
    if(rgb.r < 0 || rgb.r > 255 || rgb.g < 0 || rgb.g > 255 || rgb.b < 0 || rgb.b > 255) {
      throw new Error("RGB values must be between 0 and 255");
    }
    return (
      `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b)
        .toString(16)
        .slice(1)
        .toUpperCase()}` as const
    );
  }
}