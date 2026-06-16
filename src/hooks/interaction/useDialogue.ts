import { useState, useCallback, useMemo } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { asset } from "@/utils/asset";


const playerSprites = {
  marcelo: asset("assets/player/marcelo/default.svg"),
  eduarda: asset("assets/player/eduarda/default.svg"),
  lucas: asset("assets/player/lucas/default.svg"),
  artur: asset("assets/player/artur/default.svg"),
  camilly: asset("assets/player/camilly/default.svg"),
  emanuel: asset("assets/player/emanuel/default.svg"),
  mayra: asset("assets/player/mayra/default.svg"),
  riquelme: asset("assets/player/riquelme/default.svg"),
  samuel: asset("assets/player/samuel/default.svg"),
  larissa: asset("assets/player/larissa/default.svg"),
  lucaua: asset("assets/player/lucaua/default.svg"),
  hiago: asset("assets/player/hiago/default.svg"),
};

export function useDialogue(dialogues: Dialogue[], onFinish?: () => void) {
  const { player } = usePlayer();

  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [customDialogues, setCustomDialogues] = useState<Dialogue[] | null>(
    null,
  );

  const activeDialogues = customDialogues ?? dialogues;

  // 🔥 AQUI É A MÁGICA
  const processedDialogues = useMemo(() => {
    const storedName = localStorage.getItem("playerName") || "Protagonista";

    return activeDialogues.map((line) => {
      if (line.isPlayer) {
        return {
          ...line,
          name: storedName, // 🔥 substitui o nome
          src: playerSprites[player.character],
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
      setCustomDialogues(null);
      onFinish?.();
      return;
    }
    setIndex((prev) => prev + 1);
  }, [index, processedDialogues.length, onFinish]);

  const dialogue = useMemo(() => {
    return processedDialogues[index];
  }, [processedDialogues, index]);

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
    }),
    [dialogue, isOpen, start, next, isLast, index, processedDialogues.length],
  );
}
