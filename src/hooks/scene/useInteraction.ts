import { useCallback } from "react";
import { useInteraction } from "@/hooks/interaction/useInteraction";
import type {
  InteractionHandler,
  DialogueSystem,
} from "@/utils/types/sceneHooks";

type Props = {
  player: Player;
  map: number[][];
  dialogueSystem: DialogueSystem;
  playSansTalking: () => void;
  onInteract?: InteractionHandler;
  isReady: boolean;
};

export function useSceneInteraction({
  player,
  map,
  dialogueSystem,
  playSansTalking,
  onInteract,
  isReady,
}: Props) {
  const handleInteract = useCallback(
    (tile: number, x: number, y: number) => {
      if (!isReady) return false;

      if (dialogueSystem.isOpen) {
        dialogueSystem.next();
        if (!dialogueSystem.nextSoundSrc) {
          playSansTalking();
        }
        return true;
      }

      if (onInteract) {
        const handled = onInteract(tile, x, y);
        if (handled) return true;
      }

      if (tile === 2) {
        dialogueSystem.start();
        if (!dialogueSystem.nextSoundSrc) {
          playSansTalking();
        }
        return true;
      }

      return false;
    },
    [dialogueSystem, playSansTalking, onInteract, isReady],
  );

  useInteraction({
    player,
    map,
    onInteract: handleInteract,
  });
}
