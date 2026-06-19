import { ATTACK_SOUNDS } from "@/data/player/attackSounds";

export function playAttackSound(character: Player["character"]) {
  const config = ATTACK_SOUNDS[character];

  if (!config) return;

  const pick = config.sounds[Math.floor(Math.random() * config.sounds.length)];

  const audio = new Audio(pick);

  const saved = localStorage.getItem("game_volume");
  const masterVolume = saved !== null ? Number(saved) : 50;
  audio.volume = config.volume * (masterVolume / 100);
  audio.play().catch(() => {});
}
