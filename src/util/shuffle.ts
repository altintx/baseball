import { mulberry32 } from "./random/mulberry32";

// Deterministic (seeded) Fisher-Yates shuffle in-place.
export function seededShuffle<T>(arr: T[], seed: number): void {
  const rnd = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
}