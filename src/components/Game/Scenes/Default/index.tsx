import { usePlayer } from "@/contexts/PlayerContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useGameLayout } from "@/hooks/useGameLayout";
import { GameMap } from "@/components/Game/GameMap";
import { Player } from "@/components/Game/Player";
import { NPC } from "@/components/Game/Npc";
import Talking from "@/components/Talking";
import { useDialogue } from "@/hooks/interaction/useDialogue";
import { useSansTalking } from "@/hooks/interaction/useSansTalking";
import { useEffect, useRef } from "react";

import { useSceneNavigation } from "@/hooks/scene/useNavigation";
import { useSceneSetup } from "@/hooks/scene/useSetup";
import { useSceneControls } from "@/hooks/scene/useControls";
import { useSceneInteraction } from "@/hooks/scene/useInteraction";
import { useSceneAudio } from "@/hooks/scene/useAudio";
import { useNavigate } from "react-router";

import type { ExploreSceneProps } from "@/utils/types/maps/exploreScene";

export function ExploreScene({
  map,
  dialogueData = [],
  initialPosition,
  npcs = [],
  audio,
  transitions,
  onInteract,
  autoStartDialogue,
  onFinish,
  nextRoute,
  className,
}: ExploreSceneProps) {
  const { player, setMap, setPosition, setMode } = usePlayer();
  const { pushControls, popControls } = useGameControls();
  const navigate = useNavigate();

  const handleFinish = () => {
    if (onFinish) onFinish();

    if (nextRoute) {
      navigate(nextRoute);
    }
  };

  const dialogueSystem = useDialogue(dialogueData, handleFinish);
  const { play: playSansTalking } = useSansTalking(dialogueSystem.isOpen);
  const hasStarted = useRef(false);

  const { isReady } = useSceneSetup({
    map,
    initialPosition,
    setMap,
    setPosition,
  });

  useSceneNavigation({
    player,
    transitions,
  });

  useSceneControls({
    pushControls,
    popControls,
    dialogueSystem,
    playSansTalking,
    setMode,
  });

  useSceneInteraction({
    player,
    map,
    dialogueSystem,
    playSansTalking,
    onInteract,
    isReady,
  });

  useSceneAudio({
    audio,
  });

  useEffect(() => {
    if (autoStartDialogue && !hasStarted.current) {
      hasStarted.current = true;
      dialogueSystem.start();
      playSansTalking();
    }
  }, [autoStartDialogue, dialogueSystem, playSansTalking]);

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } =
    useGameLayout();

  if (!isReady) return null;

  return (
    <div className={className}>
      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        {npcs.map((npc, index) => (
          <NPC key={index} {...npc} TILE_SIZE={TILE_SIZE} />
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
        <Talking {...dialogueSystem.dialogue} />
      )}
    </div>
  );
}