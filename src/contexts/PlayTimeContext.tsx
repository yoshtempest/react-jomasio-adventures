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
type BattleTimeData = Record<Character, number>;
type VisitedData = Record<string, string[]>;

type StoredData = {
  playTime: PlayTimeData;
  battleTime: BattleTimeData;
  visited: VisitedData;
};

function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(PLAY_TIME_KEY);
    if (!raw) return createDefault();
    const parsed = JSON.parse(raw) as Partial<StoredData>;
    return {
      playTime: normalizeRecord(parsed.playTime, 0),
      battleTime: normalizeRecord(parsed.battleTime, 0),
      visited: parsed.visited ?? {},
    };
  } catch {
    return createDefault();
  }
}

function saveData(data: StoredData): void {
  try {
    localStorage.setItem(PLAY_TIME_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function createDefault(): StoredData {
  return {
    playTime: createRecord(0),
    battleTime: createRecord(0),
    visited: {},
  };
}

function createRecord(defaultVal: number): PlayTimeData {
  const data = {} as PlayTimeData;
  for (const char of CHARACTERS) {
    data[char] = defaultVal;
  }
  return data;
}

function normalizeRecord(
  raw: Partial<PlayTimeData> | undefined,
  defaultVal: number,
): PlayTimeData {
  const data = createRecord(defaultVal);
  if (raw) {
    for (const char of CHARACTERS) {
      if (typeof raw[char] === "number") {
        data[char] = raw[char];
      }
    }
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
  battleTime: BattleTimeData;
  visited: VisitedData;
  addBattleTime: (character: Character, seconds: number) => void;
  recordTile: (route: string, x: number, y: number) => void;
  getTotalPlayTime: () => number;
  getTotalBattleTime: () => number;
  getVisitedCount: (character: Character) => number;
};

const PlayTimeContext = createContext({} as ContextType);

export function PlayTimeProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredData>(loadData);
  const { player } = usePlayer();
  const currentCharRef = useRef(player.character);

  useEffect(() => {
    currentCharRef.current = player.character;
  }, [player.character]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const char = currentCharRef.current;
      setData((prev) => {
        const updated = {
          ...prev,
          playTime: { ...prev.playTime, [char]: prev.playTime[char] + 1 },
        };
        saveData(updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function addBattleTime(character: Character, seconds: number) {
    setData((prev) => {
      const updated = {
        ...prev,
        battleTime: {
          ...prev.battleTime,
          [character]: prev.battleTime[character] + seconds,
        },
      };
      saveData(updated);
      return updated;
    });
  }

  function recordTile(route: string, x: number, y: number) {
    const char = player.character;
    const key = `${route}:${x},${y}`;
    setData((prev) => {
      const charVisited = prev.visited[char] ?? [];
      if (charVisited.includes(key)) return prev;
      const updated = {
        ...prev,
        visited: {
          ...prev.visited,
          [char]: [...charVisited, key],
        },
      };
      saveData(updated);
      return updated;
    });
  }

  function getTotalPlayTime(): number {
    let total = 0;
    for (const char of CHARACTERS) {
      total += data.playTime[char];
    }
    return total;
  }

  function getTotalBattleTime(): number {
    let total = 0;
    for (const char of CHARACTERS) {
      total += data.battleTime[char];
    }
    return total;
  }

  function getVisitedCount(character: Character): number {
    return data.visited[character]?.length ?? 0;
  }

  return (
    <PlayTimeContext.Provider
      value={{
        playTime: data.playTime,
        battleTime: data.battleTime,
        visited: data.visited,
        addBattleTime,
        recordTile,
        getTotalPlayTime,
        getTotalBattleTime,
        getVisitedCount,
      }}
    >
      {children}
    </PlayTimeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayTime() {
  return useContext(PlayTimeContext);
}
