import { createContext, useContext, useState, type ReactNode } from "react";

type AudioContextType = {
  volume: number;
  setVolume: (value: number) => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem("game_volume");

        return saved ? Number(saved) : 50;
    });
  

    return (
        <AudioContext.Provider value={{ volume, setVolume }}>
        {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
  const ctx = useContext(AudioContext);

  if (!ctx) {
    throw new Error("useAudio precisa do AudioProvider");
  }

  return ctx;
}