import { ATTACK_SOUNDS } from "@/data/player/attackSounds";

const pool = new Map<string, HTMLAudioElement>();

export function playAttackSound(character: Player["character"]) {
  const config = ATTACK_SOUNDS[character];

  if (!config) return;

  const pick = config.sounds[Math.floor(Math.random() * config.sounds.length)];

  let audio = pool.get(pick);

  if (!audio) {
    audio = new Audio(pick);
    pool.set(pick, audio);
  }

  const saved = localStorage.getItem("game_sfx_volume");
  const sfxVolume = saved !== null ? Number(saved) : 50;

  audio.pause();
  audio.currentTime = 0;
  audio.volume = config.volume * (sfxVolume / 100);
  audio.play().catch(() => {});
}
