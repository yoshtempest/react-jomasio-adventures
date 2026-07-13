import { useState, useCallback, useMemo, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { characterSprites } from "@/data/characters/sprites";

export function useDialogue(dialogues: Dialogue[], onFinish?: () => void) {
  const { player } = usePlayer();

  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [customDialogues, setCustomDialogues] = useState<Dialogue[] | null>(
    null,
  );
  const customDialoguesRef = useRef(customDialogues);
  customDialoguesRef.current = customDialogues;

  const activeDialogues = customDialogues ?? dialogues;

  // 🔥 AQUI É A MÁGICA
  const processedDialogues = useMemo(() => {
    const storedName = localStorage.getItem("playerName") || "Protagonista";

    return activeDialogues.map((line) => {
      if (line.isPlayer) {
        return {
          ...line,
          name: storedName, // 🔥 substitui o nome
          src: characterSprites[player.character],
        };
      }

      return line;
    });
  }, [activeDialogues, player.character]);

  const start = useCallback((newDialogues?: Dialogue[]) => {
    if (newDialogues) {
      setCustomDialogues(newDialogues);
    }
    setIndex(0);
    setIsOpen(true);
  }, []);

  const next = useCallback(() => {
    if (index >= processedDialogues.length - 1) {
      setIsOpen(false);
      const wasSubDialogue = customDialoguesRef.current !== null;
      setCustomDialogues(null);
      if (!wasSubDialogue) {
        onFinish?.();
      }
      return;
    }
    setIndex((prev) => prev + 1);
  }, [index, processedDialogues.length, onFinish]);

  const dialogue = useMemo(() => {
    return processedDialogues[index];
  }, [processedDialogues, index]);

  const nextSoundSrc = useMemo(() => {
    if (!isOpen) return processedDialogues[0]?.soundSrc;
    const nextIdx = index + 1;
    if (nextIdx >= processedDialogues.length) return undefined;
    return processedDialogues[nextIdx]?.soundSrc;
  }, [isOpen, index, processedDialogues]);

  const isLast = index === processedDialogues.length - 1;

  return useMemo(
    () => ({
      dialogue,
      isOpen,
      start,
      next,
      isLast,
      index,
      length: processedDialogues.length,
      nextSoundSrc,
    }),
    [dialogue, isOpen, start, next, isLast, index, processedDialogues.length, nextSoundSrc],
  );
}
