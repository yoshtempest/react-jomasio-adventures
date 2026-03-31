import { useEffect, useMemo, useCallback, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import styles from "./styles.module.css";
import { director } from "@/maps/director";
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


export default function Director() {
  const { player, setMap, setMode } = usePlayer();
  const { setOnConfirm } = useGameControls();
  const hasPlayedDialogue = useRef(false);

  const dialogueSystem = useDialogue([
    {
      src: "/src/assets/default.svg",
      name: "Protagonista",
      message: "Que lugar é esse? Parence uma cela de prisão...",
    },
    {
      src: "/src/assets/npcs/system/right.svg",
      name: "Janela de Sistema",
      message: "Janela de sistema desbloqueada!",
    },
    {
      src: "/src/assets/default.svg",
      name: "Protagonista",
      message: "Mas que poha é essa?",
    },
    {
      src: "/src/assets/npcs/system/right.svg",
      name: "Janela de Sistema",
      message: "Se vira ai. Não sou pago pra isso",
    },
    {
      src: "/src/assets/default.svg",
      name: "Protagonista",
      message: "Então vai se fu- não vou me estressar com isso.",
    },
  ],
);

  const { play: playSansTalking } = useSansTalking(dialogueSystem.isOpen);

  const backgroundAudio = useMemo(() => ({
    src: LavenderTown,
    loop: true,
    volume: 0.5,
  }), []);

  useGameAudio(backgroundAudio);

  const handleInteract = useCallback(() => {
    if (dialogueSystem.isOpen) {
      dialogueSystem.next();
      playSansTalking();
      return;
    }
  }, [dialogueSystem.isOpen, playSansTalking]);

  useInteraction({
    player,
    map: director,
    setOnConfirm,
    onInteract: handleInteract
  });

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } =
    useGameLayout();

  useEffect(() => {
    setMap(director);
    setMode("explore");

      if (!hasPlayedDialogue.current) {
        dialogueSystem.start();
        playSansTalking();
        hasPlayedDialogue.current = true;
      }
      if (!hasPlayedDialogue.current) return;
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
          src="/src/assets/npcs/system/default.svg"
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