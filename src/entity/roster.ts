import { TeamPlayer } from "./team-player";

export type ActiveRoster = [
  TeamPlayer, 
  TeamPlayer,
  TeamPlayer,
  TeamPlayer,
  TeamPlayer,
  TeamPlayer,
  TeamPlayer,
  TeamPlayer,
  TeamPlayer,
  ...TeamPlayer[]
];

// An active roster should have 25, but I need 9 for the simulation to work
