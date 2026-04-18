import { useState, useCallback, useMemo } from "react";
import { usePlayer } from "@/contexts/PlayerContext";

import marceloDefault from "@/assets/player/marcelo/default.svg";
import eduardaDefault from "@/assets/player/eduarda/default.svg";
import lucasDefault from "@/assets/player/lucas/default.svg";
import arturDefault from "@/assets/player/artur/default.svg";
import camillyDefault from "@/assets/player/camilly/default.svg";
import emanuelDefault from "@/assets/player/emanuel/default.svg";
import mayraDefault from "@/assets/player/mayra/default.svg";
import riquelmeDefault from "@/assets/player/riquelme/default.svg";
import samuelDefault from "@/assets/player/samuel/default.svg";
import larissaDefault from "@/assets/player/larissa/default.svg";
import lucauaDefault from "@/assets/player/lucaua/default.svg";


type Dialogue = {
  src?: string;
  name: string;
  message: string;
  isPlayer?: boolean; // 👈 ADICIONE
};

const playerSprites = {
  marcelo: marceloDefault,
  eduarda: eduardaDefault,
  lucas: lucasDefault,
  artur: arturDefault,
  camilly: camillyDefault,
  emanuel: emanuelDefault,
  mayra: mayraDefault,
  riquelme: riquelmeDefault,
  samuel: samuelDefault,
  larissa: larissaDefault,
  lucaua: lucauaDefault,
};

export function useDialogue(
  dialogues: Dialogue[],
  onFinish?: () => void
) {
  const { player } = usePlayer();

  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // 🔥 AQUI É A MÁGICA
  const processedDialogues = useMemo(() => {
    const storedName = localStorage.getItem("playerName") || "Protagonista";

    return dialogues.map((line) => {
      if (line.isPlayer) {
        return {
          ...line,
          name: storedName, // 🔥 substitui o nome
          src: playerSprites[player.character],
        };
      }

      return line;
    });
  }, [dialogues, player.character]);

  const start = useCallback(() => {
    setIndex(0);
    setIsOpen(true);
  }, []);

  const next = useCallback(() => {
    setIndex((prev) => {
      if (prev >= processedDialogues.length - 1) {
        setIsOpen(false);
        onFinish?.();
        return 0;
      }
      return prev + 1;
    });
  }, [processedDialogues.length, onFinish]);

  const dialogue = useMemo(() => {
    return processedDialogues[index];
  }, [processedDialogues, index]);

  const isLast = index === processedDialogues.length - 1;

  return useMemo(() => ({
    dialogue,
    isOpen,
    start,
    next,
    isLast,
    index,
    length: processedDialogues.length,
  }), [dialogue, isOpen, start, next, isLast, index, processedDialogues.length]);
}