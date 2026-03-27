import { useEffect, useMemo, useCallback } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import styles from "./styles.module.css";
import { cantina } from "@/maps/cantina";
import { useGameLayout } from "@/hooks/useGameLayout";
import { GameMap } from "@/components/Game/GameMap";
import { Player } from "@/components/Game/Player";
import { NPC } from "@/components/Game/Npc";
import Talking from "@/components/Talking";
import { useDialogue } from "@/hooks/useDialogue";
import { useInteraction } from "@/hooks/useInteraction";
import LavenderTown from "@/assets/LavenderTown.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useSansTalking } from "@/hooks/useSansTalking";


export default function Cantina() {
  const { player, setMap } = usePlayer();
  const { setOnConfirm } = useGameControls();

  const dialogueSystem = useDialogue([
    {
      src: "/src/assets/jhowsimar/right.svg",
      name: "Jhow Simar",
      message: "Tu... tu tá com um objeto amaldiçoado!",
    },
    {
      src: "/src/assets/default.svg",
      name: "Protagonista",
      message: "Como assim? O que vo-",
    },
    {
      src: "/src/assets/jhowsimar/right.svg",
      name: "Jhow Simar",
      message: "Pega a lapada pega",
    },
  ]);

  const { play: playSansTalking } = useSansTalking(dialogueSystem.isOpen);

  const backgroundAudio = useMemo(() => ({
    src: LavenderTown,
    loop: true,
    volume: 0.5,
  }), []);

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
    map: cantina,
    setOnConfirm,
    onInteract: handleInteract
  });

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } =
    useGameLayout();

  useEffect(() => {
    setMap(cantina);
  }, [setMap]);

  return (
    <div className={`Master ${styles.image}`}>
      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        <NPC src="/src/assets/jhowsimar/default.svg" gridX={9} gridY={4} TILE_SIZE={TILE_SIZE} />
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