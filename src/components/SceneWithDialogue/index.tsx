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


type NPCData = {
  src: string;
  gridX: number;
  gridY: number;
};

type AudioConfig = {
  src: string;
  loop?: boolean;
  volume?: number;
};

type Props = {
  map: number[][];
  dialogueData: any;
  nextRoute?: string;
  initialPosition?: {
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  };
  npcs?: NPCData[];
  audio?: AudioConfig;
  onInteract?: (tile: number, x: number, y: number) => boolean;
};

export function SceneWithDialogue({
  map,
  dialogueData,
  nextRoute,
  initialPosition,
  npcs = [],
  audio,
  onInteract,
}: Props) {
  const { player, setMap, setMode, setPosition } = usePlayer();
  const { setOnConfirm } = useGameControls();
  const navigate = useNavigate();

  const dialogueSystem = useDialogue(dialogueData, () => {
    if (nextRoute) {
      navigate(nextRoute);
    }
  });

  const { play: playSansTalking } = useSansTalking(dialogueSystem.isOpen);

  const backgroundAudio = useMemo(() => ({
    src: audio?.src ?? "",
    loop: true,
    volume: 0.5,
  }), [audio]);

  useGameAudio(backgroundAudio);

  const handleInteract = useCallback((tile: number, x: number, y: number) => {
    // 1️⃣ diálogo aberto → continua
    if (dialogueSystem.isOpen) {
      dialogueSystem.next();
      playSansTalking();
      return;
    }

    // 2️⃣ interação custom da página
    if (onInteract) {
      const handled = onInteract(tile, x, y);
      if (handled) return; // 👈 só bloqueia se realmente tratou
    }

    // 3️⃣ comportamento padrão (NPC)
    if (tile === 2) {
      dialogueSystem.start();
      playSansTalking();
    }
  }, [dialogueSystem, playSansTalking, onInteract]);

  useInteraction({
    player,
    map,
    setOnConfirm,
    onInteract: handleInteract,
  });

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } =
    useGameLayout();

  useEffect(() => {
    setMap(map);
    setMode("explore");
    if (initialPosition) {
      setPosition(
        initialPosition.x,
        initialPosition.y,
        initialPosition.direction
      );
    }
  }, [map]);

  return (
    <div>
      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        {/* 🧍 NPCs dinâmicos */}
        {npcs.map((npc, index) => (
          <NPC
            key={index}
            src={npc.src}
            gridX={npc.gridX}
            gridY={npc.gridY}
            TILE_SIZE={TILE_SIZE}
          />
        ))}

        <Player
          character={player.character}
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