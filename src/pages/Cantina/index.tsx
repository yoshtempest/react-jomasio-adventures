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
import { useDialogue } from "@/hooks/interaction/useDialogue";
import { useInteraction } from "@/hooks/interaction/useInteraction";
import LavenderTown from "@/assets/LavenderTown.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useSansTalking } from "@/hooks/useSansTalking";
import { useNavigate } from "react-router";
import { cantinaDialogue } from "@/data/cantina";


export default function Cantina() {
  const { player, setMap, setMode, setPosition } = usePlayer();
  const { setOnConfirm } = useGameControls();
  const navigate = useNavigate();

  const dialogueSystem = useDialogue(
    cantinaDialogue,
    () => {
      navigate("/director");
    }
  );

  const { play: playSansTalking } = useSansTalking(dialogueSystem.isOpen);

  const backgroundAudio = useMemo(() => ({
    src: LavenderTown,
    loop: true,
    volume: 0.5,
  }), []);

  useEffect(() => {
    if (player.gridX === 15 && player.gridY === 11) {
      navigate("/hallone");
    }
  }, [player]);

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
    setMode("explore");
    setPosition(5, 11, "up");
  }, []);

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