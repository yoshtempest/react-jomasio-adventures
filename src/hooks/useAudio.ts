import { useSyncExternalStore, useCallback, useMemo } from "react";
import { SFX_KEY, BGM_KEY } from "@/data/storageKeys";

type AudioSettings = {
  sfxVolume: number;
  bgmVolume: number;
};

function readAudio(): AudioSettings {
  const rawSfx = localStorage.getItem(SFX_KEY);
  const sfxParsed = rawSfx ? Number(rawSfx) : 50;
  const sfxVolume = Number.isFinite(sfxParsed) ? sfxParsed : 50;

  const rawBgm = localStorage.getItem(BGM_KEY);
  const bgmParsed = rawBgm ? Number(rawBgm) : 50;
  const bgmVolume = Number.isFinite(bgmParsed) ? bgmParsed : 50;

  return { sfxVolume, bgmVolume };
}

let cached = readAudio();

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): AudioSettings {
  return cached;
}

function emitChange(): void {
  cached = readAudio();
  for (const l of listeners) l();
}

export type AudioReturn = AudioSettings & {
  setSfxVolume: (value: number) => void;
  setBgmVolume: (value: number) => void;
};

export function useAudio(): AudioReturn {
  const s = useSyncExternalStore(subscribe, getSnapshot);

  const setSfxVolume = useCallback((value: number) => {
    localStorage.setItem(SFX_KEY, String(value));
    emitChange();
  }, []);

  const setBgmVolume = useCallback((value: number) => {
    localStorage.setItem(BGM_KEY, String(value));
    emitChange();
  }, []);

  return useMemo(
    () => ({ ...s, setSfxVolume, setBgmVolume }),
    [s, setSfxVolume, setBgmVolume],
  );
}
