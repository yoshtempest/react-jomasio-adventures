import { useState } from "react";

type Dialogue = {
  src?: string;
  name: string;
  message: string;
};

export function useDialogue(dialogues: Dialogue[]) {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  function start() {
    setIndex(0);
    setIsOpen(true);
  }

  function next() {
    setIndex((prev) => {
      if (prev >= dialogues.length - 1) {
        setIsOpen(false);
        return 0;
      }
      return prev + 1;
    });
  }

  return {
    dialogue: dialogues[index],
    isOpen,
    start,
    next,
  };
}