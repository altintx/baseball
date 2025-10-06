import { Field } from "../entity/field";

export function renderFieldAsText(field: Field): string {
  // twenty characters wide
  // # plus 2 digits plus two spaces per position
  // 1B 2B 3B and H have home and away players
  const CF = field.fielders.CF.number,
        LF = field.fielders.LF.number,
        RF = field.fielders.RF.number;
  const B3 = field.fielders["3B"].number,
        SS = field.fielders.SS.number,
        B2 = field.fielders["2B"].number,
        B1 = field.fielders["1B"].number;
  const P = field.fielders.P.number,
        C = field.fielders.C.number;
  const OBH = field.onBase.H ? "#" + field.onBase.H.number : "--",
        OB1 = field.onBase["1B"]? "R" : " ",
        OB2 = field.onBase["2B"] ? "R" : " ",
        OB3 = field.onBase["3B"] ? "R" : " ";
  const lines = [
    ``,
    `          #${CF}        `,
    `  #${LF}           #${RF}  `,
    ``,
    `          #${B2}${OB2}           `,
    `      #${SS}        `,
    `    #${B3}${OB3}  #${P}  ${OB1}#${B1}   `,
    ``,
    `          ${OBH}                `,
    `          #${C}                `,
  ];
  return lines.join("\n");
}