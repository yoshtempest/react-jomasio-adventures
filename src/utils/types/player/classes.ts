import type { PlayerClass } from "@/utils/types/player/player";

export const CLASSES: PlayerClass[] = [
  "fracote",
  "idiota",
  "amostradinho",
];

export const SPECIAL_HITS_BY_CLASS = {
  fracote: 4,
  default: 6,
};

export const CLASS_DAMAGE_MODIFIER = {
  amostradinho: 1.1,
  idiota: 0.8,
};