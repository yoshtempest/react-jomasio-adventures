import { asset } from "@/utils/asset";
import { useGameAudio } from "../useGameAudio";

export function useMenuSFX() {
  const moveAudio = useGameAudio({
    src: asset("/assets/songs/soundEffects/menu/move.mp3"),
    loop: false,
    volume: 1,
  });

  const selectAudio = useGameAudio({
    src: asset("/assets/songs/soundEffects/menu/select.mp3"),
    loop: false,
    volume: 1,
  });

  const closeAudio = useGameAudio({
    src: asset("/assets/songs/soundEffects/menu/close.mp3"),
    loop: false,
    volume: 1,
  });

  function playMove() {
    moveAudio.stop();
    moveAudio.play();
  }

  function playSelect() {
    selectAudio.stop();
    selectAudio.play();
  }

  function playClose() {
    closeAudio.stop();
    closeAudio.play();
  }

  return {
    playMove,
    playSelect,
    playClose,
  };
}