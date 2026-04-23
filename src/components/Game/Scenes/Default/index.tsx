import { useEffect, useMemo, useCallback, useState } from "react";
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
import { useSansTalking } from "@/hooks/interaction/useSansTalking";
import { useNavigate } from "react-router";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";


type NPCData = {
  src: string;
  gridX: number;
  gridY: number;
};

type Position = {
  x: number;
  y: number;
};

type Transition = {
  positions: Position[];
  to: string;
};

type AudioConfig = {
  src: string;
  loop?: boolean;
  volume?: number;
};

type Props = {
  map: number[][];
  dialogueData?: any;
  nextRoute?: string;
  initialPosition?: {
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  };
  npcs?: NPCData[];
  audio?: AudioConfig;
  transitions?: Transition[];
  onInteract?: (tile: number, x: number, y: number) => boolean;
  autoStartDialogue?: boolean;
  onFinish?: () => void;
  className?: string;
};

export function ExploreScene({
  map,
  dialogueData = [],
  nextRoute,
  initialPosition,
  npcs = [],
  audio = {
    src: LavenderTown,
    loop: true,
    volume: 0.5,
  },
  autoStartDialogue = false,
  transitions,
  className,
  onInteract,
  onFinish,
}: Props) {
  const { player, setMap, setPosition, setMode } = usePlayer();
  const { pushControls, popControls } = useGameControls();
  const navigate = useNavigate();
  const [shouldNavigate, setShouldNavigate] = useState(false);

  
  const dialogueSystem = useDialogue(dialogueData, () => {
    if (onFinish) {
      onFinish();
      return;
    }

    if (nextRoute) {
      setShouldNavigate(true);
    }
  });

  const { play: playSansTalking } = useSansTalking(dialogueSystem.isOpen);

  useEffect(() => {
    if (autoStartDialogue && !dialogueSystem.isOpen) {
      dialogueSystem.start();
      playSansTalking();
    }
  }, [autoStartDialogue, dialogueSystem, playSansTalking]);

  useEffect(() => {
    if (shouldNavigate && nextRoute) {
      navigate(nextRoute);
    }
  }, [shouldNavigate, nextRoute, navigate]);

  useEffect(() => {
    setMode("explore");
    const controls = {
      onConfirm: () => {
        if (!dialogueSystem.isOpen) return false;
        dialogueSystem.next();
        playSansTalking();
        return true;
      },
    };

    pushControls(controls);

    return () => popControls();
  }, []);

  useEffect(() => {
    if (!transitions || transitions.length === 0) return;
      transitions.forEach(({ positions, to }) => {
        const match = positions.some(
          (pos) => pos.x === player.gridX && pos.y === player.gridY
        );

        if (match) {
          navigate(to);
        }
    });
  }, [player, transitions, navigate]);

  const backgroundAudio = useMemo(() => {
    const safeAudio = audio ?? {
      src: LavenderTown,
      loop: true,
      volume: 0.5,
    };

    return {
      src: safeAudio.src,
      loop: safeAudio.loop ?? true,
      volume: safeAudio.volume ?? 0.5,
    };
  }, [audio]);

  useGameAudio(backgroundAudio);

  const handleInteract = useCallback((tile: number, x: number, y: number) => {
    // 1️⃣ diálogo aberto → continua
    if (dialogueSystem.isOpen) {
      dialogueSystem.next();
      playSansTalking();
      return true;
    }

    // 2️⃣ interação custom da página
    if (onInteract) {
      const handled = onInteract(tile, x, y);
      if (handled) return true; // 👈 só bloqueia se realmente tratou
    }

    // 3️⃣ comportamento padrão (NPC)
    if (tile === 2) {
      dialogueSystem.start();
      playSansTalking();
      return true;
    }

    return false;
  }, [dialogueSystem, playSansTalking, onInteract]);

  useInteraction({
    player,
    map,
    onInteract: handleInteract,
  });

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } =
    useGameLayout();

  useEffect(() => {
    setMap(map);
    if (initialPosition) {
      setPosition(
        initialPosition.x,
        initialPosition.y,
        initialPosition.direction
      );
    }
  }, [map]);

  return (
    <div className={className}>
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