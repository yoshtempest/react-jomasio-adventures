import { useCallback, useMemo } from "react";
import { SFX_KEY, BGM_KEY } from "@/data/storageKeys";
import { type AudioReturn, audioStore } from "./constants";

export function useAudio(): AudioReturn {
  const s = audioStore.useValue();

  const setSfxVolume = useCallback((value: number) => {
    localStorage.setItem(SFX_KEY, String(value));
    audioStore.emitChange();
  }, []);

  const setBgmVolume = useCallback((value: number) => {
    localStorage.setItem(BGM_KEY, String(value));
    audioStore.emitChange();
  }, []);

  return useMemo(
    () => ({ ...s, setSfxVolume, setBgmVolume }),
    [s, setSfxVolume, setBgmVolume],
  );
}
