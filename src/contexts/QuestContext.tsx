import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { DAILY_QUEST_POOL, WEEKLY_QUEST_POOL } from "@/data/quests";
import {
  getTodayDate,
  getWeekStart,
  generateQuestsFromPool,
} from "@/data/quests/generation";
import { saveCompressed, loadCompressed } from "@/utils/storage";

const QUESTS_KEY = "jomasio_quests";

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
  refreshDailyWeekly: () => void;
};

const QuestContext = createContext({} as QuestContextType);

export function QuestProvider({ children }: Props) {
  const [quests, setQuests] = useState<Quest[]>(() =>
    loadCompressed<Quest[]>(QUESTS_KEY) ?? [],
  );
  const { playSound } = useSoundEffects();

  useEffect(() => {
    saveCompressed(QUESTS_KEY, quests);
  }, [quests]);

  const generateDailyWeekly = useCallback(() => {
    setQuests((prev) => {
      const todayDate = getTodayDate();
      const weekStart = getWeekStart();
      const savedDailyDate = localStorage.getItem("dailyQuestDate");
      const savedWeeklyDate = localStorage.getItem("weeklyQuestDate");

      const hasDaily = prev.some((q) => q.frequency === "daily");
      const hasWeekly = prev.some((q) => q.frequency === "weekly");

      const needsDailyReset = savedDailyDate !== todayDate || !hasDaily;
      const needsWeeklyReset = savedWeeklyDate !== weekStart || !hasWeekly;

      if (!needsDailyReset && !needsWeeklyReset) return prev;

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
        refreshDailyWeekly: generateDailyWeekly,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useQuests = () => useContext(QuestContext);
