import { createContext, useContext, useState } from "react";
import type { Quest } from "@/utils/types/player/quest";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type QuestContextType = {
  quests: Quest[];
  addQuest: (quest: Quest) => void;
  updateProgress: (id: string, value: number) => void;
};

const QuestContext = createContext({} as QuestContextType);

export function QuestProvider({ children }: Props) {
  const [quests, setQuests] = useState<Quest[]>([]);

  function addQuest(newQuest: Quest) {
    setQuests((prev) => {
      const exists = prev.find(q => q.id === newQuest.id);
      if (exists) return prev;
      return [...prev, newQuest];
    });
  }

  function updateProgress(id: string, value: number) {
    setQuests((prev) =>
      prev.map(q => {
        if (q.id !== id) return q;

        const newProgress = q.progress + value;

        return {
          ...q,
          progress: newProgress,
          completed: newProgress >= q.counter
        };
      })
    );
  }

  return (
    <QuestContext.Provider value={{ quests, addQuest, updateProgress }}>
      {children}
    </QuestContext.Provider>
  );
}

export const useQuests = () => useContext(QuestContext);