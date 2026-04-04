import { useEffect, useMemo, useCallback } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameLayout } from "@/hooks/useGameLayout";
import { GameMap } from "@/components/Game/GameMap";
import { Player } from "@/components/Game/Player";
import { NPC } from "@/components/Game/Npc";
import Talking from "@/components/Talking";
import { useDialogue } from "@/hooks/interaction/useDialogue";
import { useInteraction } from "@/hooks/interaction/useInteraction";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useSansTalking } from "@/hooks/useSansTalking";
import { useNavigate } from "react-router";
import styles from "./styles.module.css";

type Props = {
  map: number[][];
  dialogueData: any;
  nextRoute: string;
  initialPosition: {
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  };
  backgroundAudioSrc: string;
};

export function SceneWithDialogue({
  map,
  dialogueData,
  nextRoute,
  initialPosition,
  backgroundAudioSrc
}: Props) {
  const { player, setMap, setMode, setPosition } = usePlayer();
  const { setOnConfirm } = useGameControls();
  const navigate = useNavigate();

  const dialogueSystem = useDialogue(dialogueData, () => {
    navigate(nextRoute);
  });

  const { play: playSansTalking } = useSansTalking(dialogueSystem.isOpen);

  const backgroundAudio = useMemo(() => ({
    src: backgroundAudioSrc,
    loop: true,
    volume: 0.5,
  }), [backgroundAudioSrc]);

  useGameAudio(backgroundAudio);

  const handleInteract = useCallback((tile: number) => {
    if (dialogueSystem.isOpen) {
      dialogueSystem.next();
      playSansTalking();
      return;
    }

    if (tile === 2) {
      dialogueSystem.start();
      playSansTalking();
    }
  }, [dialogueSystem.isOpen, playSansTalking]);

  useInteraction({
    player,
    map,
    setOnConfirm,
    onInteract: handleInteract
  });

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } =
    useGameLayout();

  useEffect(() => {
    setMap(map);
    setMode("explore");
    setPosition(
      initialPosition.x,
      initialPosition.y,
      initialPosition.direction
    );
  }, [map]);

  return (
    <div className={`Master ${styles.image}`}>
      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        <NPC
          src="/src/assets/npcs/jhowsimar/default.svg"
          gridX={9}
          gridY={4}
          TILE_SIZE={TILE_SIZE}
        />

        <Player
          direction={player.direction}
          gridX={player.gridX}
          gridY={player.gridY}
          TILE_SIZE={TILE_SIZE}
          PLAYER_SIZE={PLAYER_SIZE}
        />
      </GameMap>

      {dialogueSystem.isOpen && (
        <Talking
          src={dialogueSystem.dialogue.src}
          name={dialogueSystem.dialogue.name}
          message={dialogueSystem.dialogue.message}
        />
      )}
    </div>
  );
}