export const PlayerAttributeBuckets = ["Strenth", "Intelligence", "Dexterity", "Charisma", "Constitution", "Wisdom"] as const;
export type PlayerAttributeBucket = typeof PlayerAttributeBuckets[number];
export class PlayerAttributePoint {
  type: PlayerAttributeBucket | null;
  value: number;
  constructor(attributes: {
    type?: PlayerAttributeBucket | null;
    value?: number;
  }) {
    this.type = attributes.type ?? null;  
    this.value = attributes.value ?? 1;
  }
}
