const Dexterities = ["Right", "Left", "Ambidextrous"] as const;
export type Dexterity = typeof Dexterities[number];
