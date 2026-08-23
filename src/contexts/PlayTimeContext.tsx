import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { CHARACTERS } from "@/data/characters/list";
import type { Character } from "@/utils/types/player/player";
import { slotKey } from "@/services/save/slotManager";

const PLAY_TIME_KEY = () => slotKey("play_time");

type PlayTimeData = Record<Character, number>;
type BattleTimeData = Record<Character, number>;
type VisitedData = Record<string, string[]>;

type StoredData = {
  playTime: PlayTimeData;
  battleTime: BattleTimeData;
  visited: VisitedData;
  loginDays: number;
  lastLoginDate: string;
  firstLoginDate: string;
};

function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(PLAY_TIME_KEY());
    if (!raw) return createDefault();
    const parsed = JSON.parse(raw) as Partial<StoredData>;
    return {
      playTime: normalizeRecord(parsed.playTime, 0),
      battleTime: normalizeRecord(parsed.battleTime, 0),
      visited: parsed.visited ?? {},
      loginDays: parsed.loginDays ?? 0,
      lastLoginDate: parsed.lastLoginDate ?? "",
      firstLoginDate: parsed.firstLoginDate ?? "",
    };
  } catch {
    return createDefault();
  }
}

function saveData(data: StoredData): void {
  try {
    localStorage.setItem(PLAY_TIME_KEY(), JSON.stringify(data));
  } catch {
    // ignore
  }
}

function createDefault(): StoredData {
  return {
    playTime: createRecord(0),
    battleTime: createRecord(0),
    visited: {},
    loginDays: 0,
    lastLoginDate: "",
    firstLoginDate: "",
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

type ContextType = {
  playTime: PlayTimeData;
  battleTime: BattleTimeData;
  visited: VisitedData;
  loginDays: number;
  firstLoginDate: string;
  addBattleTime: (character: Character, seconds: number) => void;
  recordTile: (route: string, x: number, y: number) => void;
  getTotalPlayTime: () => number;
  getTotalBattleTime: () => number;
  getVisitedCount: (character: Character) => number;
};

const PlayTimeContext = createContext<ContextType | null>(null);

export function PlayTimeProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredData>(loadData);
  const { player } = usePlayer();
  const currentCharRef = useRef(player.character);

  useEffect(() => {
    currentCharRef.current = player.character;
  }, [player.character]);

  useEffect(() => {
    const tickCountRef = { current: 0 };

    const intervalId = setInterval(() => {
      const char = currentCharRef.current;
      setData((prev) => {
        const updated = {
          ...prev,
          playTime: { ...prev.playTime, [char]: prev.playTime[char] + 1 },
        };
        tickCountRef.current++;
        if (tickCountRef.current % 30 === 0) {
          saveData(updated);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const stored = loadData();
    if (stored.lastLoginDate !== today) {
      setData((prev) => {
        const isFirstLogin = prev.loginDays === 0;
        const updated = {
          ...prev,
          loginDays: prev.loginDays + 1,
          lastLoginDate: today,
          firstLoginDate: isFirstLogin ? today : prev.firstLoginDate,
        };
        saveData(updated);
        return updated;
      });
    }
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
        loginDays: data.loginDays,
        firstLoginDate: data.firstLoginDate,
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
  const ctx = useContext(PlayTimeContext);
  if (!ctx) throw new Error("usePlayTime precisa do PlayTimeProvider");
  return ctx;
}
