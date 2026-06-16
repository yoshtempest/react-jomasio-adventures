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
import { useLocation } from "react-router";
import { useTransitionCtx } from "@/contexts/TransitionContext";
import { getTileInFront } from "@/utils/getTileInFront";
import { saveGame } from "@/utils/saveGame";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { useFlags } from "@/contexts/FlagContext";
import { useSceneEvents } from "@/hooks/scene/useEvents";

export function ExploreScene({
  map,
  dialogueData = [],
  initialPosition,
  npcs = [],
  audio,
  transitions,
  signs,
  onInteract,
  autoStartDialogue,
  onFinish,
  nextRoute,
  className,
  events,
}: ExploreSceneProps & { events?: SceneEvent[] }) {
  const { player, playerClass, setMap, setPosition, setMode } = usePlayer();
  const { pushControls, popControls } = useGameControls();
  const { navigateWithFade } = useTransitionCtx();
  const location = useLocation();
  const { items } = useInventory();
  const { quests } = useQuests();
  const { flags } = useFlags();
  const lastPage = location.state?.from;
  const { runEvent, checkCondition } = useSceneEvents();

  useEffect(() => {
    saveGame({
      lastRoute: location.pathname,
      inventory: items,
      quests,
      playerClass,
      character: player.character,
    });
  }, [location.pathname, items, quests, playerClass, player.character]);

  const handleFinish = () => {
    setTimeout(() => {
      if (events) {
        for (const event of events) {
          if (event.type === "conditional") {
            if (checkCondition(event.condition)) {
              event.then.forEach(runEvent);
              break;
            } else if (event.else) {
              event.else.forEach(runEvent);
              break;
            }
          } else {
            runEvent(event);
            break;
          }
        }
      }

      if (onFinish) onFinish();

      if (nextRoute) {
        navigateWithFade(nextRoute, { state: { from: location.pathname } });
      }
    }, 0);
  };

  const resolvedDialogueData =
    typeof dialogueData === "function"
      ? dialogueData({
          quests,
          items,
          flags,
          character: player.character,
          lastPage,
        })
      : dialogueData;

  const dialogueSystem = useDialogue(resolvedDialogueData, handleFinish);
  const { play: playSansTalking } = useSansTalking(dialogueSystem.isOpen);
  const hasStarted = useRef(false);

  const resolvedInitialPosition =
    typeof initialPosition === "function"
      ? initialPosition(lastPage) // ⚠️ aqui falta o lastPage ainda
      : initialPosition;

  const { isReady } = useSceneSetup({
    map,
    initialPosition: resolvedInitialPosition,
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
    onInteract: (tile, x, y) => {
      const front = getTileInFront(player, map);

      // 🔥 verifica NPC na frente
      const npc = npcs.find((n) => n.gridX === front.x && n.gridY === front.y);

      if (npc?.interaction) {
        npc.interaction(dialogueSystem.start);
        return true;
      }

      // fallback
      return onInteract?.(tile, x, y) ?? false;
    },
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
        {npcs.map((npc) => (
          <NPC
            key={`${npc.gridX},${npc.gridY}`}
            {...npc}
            TILE_SIZE={TILE_SIZE}
          />
        ))}

        {signs?.map((sign) => (
          <div
            key={`sign-${sign.x}-${sign.y}`}
            style={{
              position: "absolute",
              left: sign.x * TILE_SIZE,
              top: sign.y * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
              backgroundColor: "rgba(255, 0, 0, 0.5)",
              border: "1px solid red",
              zIndex: 5,
              pointerEvents: "none",
            }}
          />
        ))}

        <Player
          character={player.character}
          direction={player.direction}
          gridX={player.gridX}
          gridY={player.gridY}
          TILE_SIZE={TILE_SIZE}
          PLAYER_SIZE={PLAYER_SIZE}
          hasPeru={player.hasPeru}
        />
      </GameMap>

      {dialogueSystem.isOpen && <Talking {...dialogueSystem.dialogue} />}
    </div>
  );
}
