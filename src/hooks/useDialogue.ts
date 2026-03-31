import { useState, useCallback, useMemo } from "react";

type Dialogue = {
  src?: string;
  name: string;
  message: string;
};

export function useDialogue(
  dialogues: Dialogue[],
  onFinish?: () => void
) {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const start = useCallback(() => {
    setIndex(0);
    setIsOpen(true);
  }, []);

  const next = useCallback(() => {
    setIndex((prev) => {
      if (prev >= dialogues.length - 1) {
        setIsOpen(false);
        onFinish?.();
        return 0;
      }
      return prev + 1;
    });
  }, [dialogues.length, onFinish]);

  const dialogue = useMemo(() => {
    return dialogues[index];
  }, [dialogues, index]);

  const isLast = index === dialogues.length - 1;

  return useMemo(() => ({
    dialogue,
    isOpen,
    start,
    next,
    isLast,     // 👈 novo
    index,      // 👈 opcional (mas muito útil)
    length: dialogues.length, // 👈 opcional
  }), [dialogue, isOpen, start, next, isLast, index, dialogues.length]);
}