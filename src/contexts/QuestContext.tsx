import { createContext, useContext, useState } from "react";
import type { Quest } from "@/utils/types/player/quest";
import { type ReactNode } from "react";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

type Props = {
  children: ReactNode;
};

type QuestContextType = {
  quests: Quest[];
  addQuest: (quest: Quest) => void;
  updateProgress: (id: string, value: number) => void;
  claimQuest: (id: string) => void;
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
};

const QuestContext = createContext({} as QuestContextType);

export function QuestProvider({ children }: Props) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const { playSound } = useSoundEffects();

  function addQuest(newQuest: Quest) {
    setQuests((prev) => {
      const exists = prev.find(q => q.id === newQuest.id);
      if (exists) return prev;

      return [
        ...prev,
        {
          ...newQuest,
          claimed: false // 👈 garante consistência
        }
      ];
    });
    playSound("questUpdated");
  }

  function updateProgress(id: string, value: number) {
    setQuests((prev) =>
      prev.map(q => {
        if (q.id !== id) return q;

        const newProgress = Math.min(q.progress + value, q.counter);

        return {
          ...q,
          progress: newProgress,
          completed: newProgress >= q.counter
        };
      })
    );
    playSound("questUpdated");
  }

  function claimQuest(id: string) {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, claimed: true } : q
      )
    );
  }

  return (
    <QuestContext.Provider value={{ quests, setQuests, addQuest, updateProgress, claimQuest }}>
      {children}
    </QuestContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useQuests = () => useContext(QuestContext);