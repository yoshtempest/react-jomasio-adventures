import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { SFX_KEY, BGM_KEY } from "@/data/storageKeys";

type AudioContextType = {
  sfxVolume: number;
  setSfxVolume: (value: number) => void;
  bgmVolume: number;
  setBgmVolume: (value: number) => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [sfxVolume, setSfxVolumeState] = useState(() => {
    const saved = localStorage.getItem(SFX_KEY);
    const parsed = saved ? Number(saved) : 50;
    return Number.isFinite(parsed) ? parsed : 50;
  });

  const [bgmVolume, setBgmVolumeState] = useState(() => {
    const saved = localStorage.getItem(BGM_KEY);
    const parsed = saved ? Number(saved) : 50;
    return Number.isFinite(parsed) ? parsed : 50;
  });

  const setSfxVolume = useCallback((value: number) => {
    setSfxVolumeState(value);
    localStorage.setItem(SFX_KEY, String(value));
  }, []);

  const setBgmVolume = useCallback((value: number) => {
    setBgmVolumeState(value);
    localStorage.setItem(BGM_KEY, String(value));
  }, []);

  return (
    <AudioContext.Provider
      value={{ sfxVolume, setSfxVolume, bgmVolume, setBgmVolume }}
    >
      {children}
    </AudioContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAudio() {
  const ctx = useContext(AudioContext);

  if (!ctx) {
    throw new Error("useAudio precisa do AudioProvider");
  }

  return ctx;
}
