import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type AudioContextType = {
  volume: number;
  setVolume: (value: number) => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem("game_volume");

    return saved ? Number(saved) : 50;
  });

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    localStorage.setItem("game_volume", String(value));
  }, []);

  return (
    <AudioContext.Provider value={{ volume, setVolume }}>
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