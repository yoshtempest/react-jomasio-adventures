export const FOOTBALLCOURT_DOG_COUNT = 3;

export const BATTLE_ROUTE = "/battle/hungryDog";
export const DOG_ALFA_SIZE = 1.5 * 1.7;

/** Pontos candidatos: tiles andáveis do mapa footballCourt/one, espalhados. */
export const DOG_SPOTS: readonly { x: number; y: number }[] = [
  { x: 2, y: 4 },
  { x: 5, y: 4 },
  { x: 11, y: 4 },
  { x: 14, y: 4 },
  { x: 2, y: 6 },
  { x: 14, y: 6 },
  { x: 5, y: 8 },
  { x: 11, y: 8 },
  { x: 2, y: 10 },
  { x: 14, y: 10 },
];

export type DogSpot = { x: number; y: number; alfa: boolean };

export const NO_DOGS: DogSpot[] = [];

export const tileKey = (spot: { x: number; y: number }) =>
  `${spot.x},${spot.y}`;
