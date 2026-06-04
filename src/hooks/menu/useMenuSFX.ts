import { useSoundEffects } from "@/contexts/SoundEffectsContext";

export function useMenuSFX() {
  const { playSound } = useSoundEffects();

  function playMove() {
    playSound("moveMenu");
  }

  function playSelect() {
    playSound("selectMenu");
  }

  function playClose() {
    playSound("closeMenu");
  }

  return {
    playMove,
    playSelect,
    playClose,
  };
}