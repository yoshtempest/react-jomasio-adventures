import { createExternalStore } from "@/utils/createExternalStore";
import { readAudio } from "./readAudio";

export type AudioSettings = {
  sfxVolume: number;
  bgmVolume: number;
};

export type AudioReturn = AudioSettings & {
  setSfxVolume: (value: number) => void;
  setBgmVolume: (value: number) => void;
};

export const audioStore = createExternalStore(readAudio);