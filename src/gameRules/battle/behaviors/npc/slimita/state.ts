import { asset } from "@/utils/asset";

export const FAR_DISTANCE_X = 260;
export const MELEE_RANGE = 50;

export const boomAudio = new Audio(
  asset("/assets/songs/soundEffects/npc/boom.mp3")
);

boomAudio.volume = 0.7;