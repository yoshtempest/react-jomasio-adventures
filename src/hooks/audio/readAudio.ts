import type { AudioSettings } from "./constants";
import { SFX_KEY, BGM_KEY } from "@/data/storageKeys";

export function readAudio(): AudioSettings {
  const rawSfx = localStorage.getItem(SFX_KEY);
  const sfxParsed = rawSfx ? Number(rawSfx) : 50;
  const sfxVolume = Number.isFinite(sfxParsed) ? sfxParsed : 50;

  const rawBgm = localStorage.getItem(BGM_KEY);
  const bgmParsed = rawBgm ? Number(rawBgm) : 50;
  const bgmVolume = Number.isFinite(bgmParsed) ? bgmParsed : 50;

  return { sfxVolume, bgmVolume };
}
