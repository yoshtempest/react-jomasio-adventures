import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Quest, QuestTemplate } from "@/utils/types/player/quest";
import { type ReactNode } from "react";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { DAILY_QUEST_POOL } from "@/data/quests/daily";
import { WEEKLY_QUEST_POOL } from "@/data/quests/weekly";

type Props = {
  children: ReactNode;
};

type QuestContextType = {
  quests: Quest[];
  addQuest: (quest: Quest) => void;
  updateProgress: (id: string, value: number) => void;
  claimQuest: (id: string) => void;
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
  progressDailyWeekly: (type: string, value: number) => void;
};

const QuestContext = createContext({} as QuestContextType);

const DAILY_COUNT = 3;
const WEEKLY_COUNT = 2;

function shufflePool<T>(pool: T[], count: number): T[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getTodayDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
}

function generateQuestsFromPool(
  pool: QuestTemplate[],
  prefix: string,
): Quest[] {
  return shufflePool(pool, prefix === "daily" ? DAILY_COUNT : WEEKLY_COUNT).map(
    (template, index) => ({
      id: `${prefix}_${index}`,
      name: template.name,
      image: template.image,
      description: template.description,
      type: template.type,
      counter: template.counter,
      progress: 0,
      completed: false,
      claimed: false,
      rewardsType: template.rewardsType,
      rewards: template.rewards,
      frequency: template.frequency,
      rewardItemId: template.rewardItemId,
      progressType: template.progressType,
    }),
  );
}

export function QuestProvider({ children }: Props) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const { playSound } = useSoundEffects();

  const generateDailyWeekly = useCallback(() => {
    const todayDate = getTodayDate();
    const weekStart = getWeekStart();
    const savedDailyDate = localStorage.getItem("dailyQuestDate");
    const savedWeeklyDate = localStorage.getItem("weeklyQuestDate");

    const needsDailyReset = savedDailyDate !== todayDate;
    const needsWeeklyReset = savedWeeklyDate !== weekStart;

    if (!needsDailyReset && !needsWeeklyReset) return;

    setQuests((prev) => {
      const filtered = prev.filter(
        (q) => q.frequency !== "daily" && q.frequency !== "weekly",
      );

      if (needsDailyReset) {
        localStorage.setItem("dailyQuestDate", todayDate);
        const dailyQuests = generateQuestsFromPool(DAILY_QUEST_POOL, "daily");
        filtered.push(...dailyQuests);
      }

      if (needsWeeklyReset) {
        localStorage.setItem("weeklyQuestDate", weekStart);
        const weeklyQuests = generateQuestsFromPool(
          WEEKLY_QUEST_POOL,
          "weekly",
        );
        filtered.push(...weeklyQuests);
      }

      return filtered;
    });
  }, []);

  useEffect(() => {
    generateDailyWeekly();
  }, [generateDailyWeekly]);

  function addQuest(newQuest: Quest) {
    setQuests((prev) => {
      const exists = prev.find((q) => q.id === newQuest.id);
      if (exists) return prev;

      return [
        ...prev,
        {
          ...newQuest,
          claimed: false,
        },
      ];
    });
    playSound("questUpdated");
  }

  function updateProgress(id: string, value: number) {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;

        const newProgress = Math.min(q.progress + value, q.counter);

        return {
          ...q,
          progress: newProgress,
          completed: newProgress >= q.counter,
        };
      }),
    );
    playSound("questUpdated");
  }

  function claimQuest(id: string) {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, claimed: true } : q)),
    );
  }

  function progressDailyWeekly(type: string, value: number) {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.frequency !== "daily" && q.frequency !== "weekly") return q;
        if (q.progressType !== type) return q;
        if (q.completed) return q;

        const newProgress = Math.min(q.progress + value, q.counter);
        return {
          ...q,
          progress: newProgress,
          completed: newProgress >= q.counter,
        };
      }),
    );
    playSound("questUpdated");
  }

  return (
    <QuestContext.Provider
      value={{
        quests,
        setQuests,
        addQuest,
        updateProgress,
        claimQuest,
        progressDailyWeekly,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useQuests = () => useContext(QuestContext);
