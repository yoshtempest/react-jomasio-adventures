import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { CHARACTERS, type Character } from "@/utils/types/player/player";

const PLAY_TIME_KEY = "play_time";

type PlayTimeData = Record<Character, number>;

function loadPlayTime(): PlayTimeData {
  try {
    const raw = localStorage.getItem(PLAY_TIME_KEY);
    if (!raw) return createDefault();
    const parsed = JSON.parse(raw) as Partial<PlayTimeData>;
    const data = createDefault();
    for (const char of CHARACTERS) {
      if (typeof parsed[char] === "number") {
        data[char] = parsed[char];
      }
    }
    return data;
  } catch {
    return createDefault();
  }
}

function savePlayTime(data: PlayTimeData): void {
  try {
    localStorage.setItem(PLAY_TIME_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function createDefault(): PlayTimeData {
  const data = {} as PlayTimeData;
  for (const char of CHARACTERS) {
    data[char] = 0;
  }
  return data;
}

export function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}

type ContextType = {
  playTime: PlayTimeData;
  getTotalPlayTime: () => number;
};

const PlayTimeContext = createContext({} as ContextType);

export function PlayTimeProvider({ children }: { children: ReactNode }) {
  const [playTime, setPlayTime] = useState<PlayTimeData>(loadPlayTime);
  const { player } = usePlayer();
  const currentCharRef = useRef(player.character);

  useEffect(() => {
    currentCharRef.current = player.character;
  }, [player.character]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const char = currentCharRef.current;
      setPlayTime((prev) => {
        const updated = { ...prev, [char]: prev[char] + 1 };
        savePlayTime(updated);
        return updated;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function getTotalPlayTime(): number {
    let total = 0;
    for (const char of CHARACTERS) {
      total += playTime[char];
    }
    return total;
  }

  return (
    <PlayTimeContext.Provider value={{ playTime, getTotalPlayTime }}>
      {children}
    </PlayTimeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayTime() {
  return useContext(PlayTimeContext);
}
