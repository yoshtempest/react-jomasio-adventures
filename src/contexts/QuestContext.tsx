import { createContext, useContext, useState } from "react";
import type { Quest } from "@/utils/types/player/quest";
import { type ReactNode, useRef, useEffect } from "react";
import { asset } from "@/utils/asset";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(
        asset("/assets/songs/soundEffects/player/questUpdated.mp3")
      );
    }
  }, []);

  function playQuestSound() {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

  function addQuest(newQuest: Quest) {
    setQuests((prev) => {
      const exists = prev.find(q => q.id === newQuest.id);
      if (exists) return prev;

      playQuestSound();

      return [
        ...prev,
        {
          ...newQuest,
          claimed: false // 👈 garante consistência
        }
      ];
    });
  }

  function updateProgress(id: string, value: number) {
    setQuests((prev) =>
      prev.map(q => {
        if (q.id !== id) return q;

        const newProgress = Math.min(q.progress + value, q.counter);

        if (newProgress !== q.progress) {
          playQuestSound(); // 🔊 AQUI
        }

        return {
          ...q,
          progress: newProgress,
          completed: newProgress >= q.counter
        };
      })
    );
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

export const useQuests = () => useContext(QuestContext);