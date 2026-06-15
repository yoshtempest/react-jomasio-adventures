import type { Player } from "@/utils/types/player/player";
import { ATTACK_SOUNDS } from "@/data/player/attackSounds";

export function playAttackSound(character: Player["character"]) {
  const config = ATTACK_SOUNDS[character];

  if (!config) return;

  const pick = config.sounds[Math.floor(Math.random() * config.sounds.length)];

  const audio = new Audio(pick);

  audio.volume = config.volume;
  audio.play().catch(() => {});
}
