import { soundEffectPath } from "@/utils/paths";

export const FAR_DISTANCE_X = 260;
export const MELEE_RANGE = 50;

let boomAudio: HTMLAudioElement | null = null;

export function playBoom() {
  if (!boomAudio) {
    boomAudio = new Audio(soundEffectPath("/npc/slimita/boom.mp3"));
    boomAudio.volume = 0.7;
  }

  boomAudio.currentTime = 0;
  boomAudio.play().catch(() => {});
}
