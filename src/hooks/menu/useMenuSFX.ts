import { asset } from "@/utils/asset";
import { useRef } from "react";

export function useMenuSFX() {
  const lastPlayRef = useRef(0);

    const playMove = () => {
        const now = Date.now();
        if (now - lastPlayRef.current < 80) return;

        lastPlayRef.current = now;

        const audio = new Audio(asset("/assets/songs/soundEffects/menu/move.mp3"));
        audio.volume = 0.4; // depois a gente integra com contexto melhor
        audio.play().catch(() => {});
    };

    const playSelect = () => {
        const now = Date.now();
        if (now - lastPlayRef.current < 80) return;

        lastPlayRef.current = now;

        const audio = new Audio(asset("/assets/songs/soundEffects/menu/select.mp3"));
        audio.volume = 0.5; // depois a gente integra com contexto melhor
        audio.play().catch(() => {});
    };

    const playClose = () => {
        const now = Date.now();
        if (now - lastPlayRef.current < 80) return;

        lastPlayRef.current = now;

        const audio = new Audio(asset("/assets/songs/soundEffects/menu/close.mp3"));
        audio.volume = 0.4; // depois a gente integra com contexto melhor
        audio.play().catch(() => {});
    };

  return {
    playMove,
    playSelect,
    playClose,
  };
}