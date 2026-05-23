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
import { useSceneInteraction } from "@/hooks/scene/useSceneInteraction";
import { useSceneAudio } from "@/hooks/scene/useAudio";
import { useLocation, useNavigate } from "react-router";
import { getTileInFront } from "@/utils/getTileInFront";
import { saveGame } from "@/utils/saveGame";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import type { SceneEvent } from "@/utils/types/maps/sceneEvents";
import type { ExploreSceneProps } from "@/utils/types/maps/exploreScene";
import { QUESTS } from "@/data/quests";
import { ITEMS } from "@/data/items";
import { useFlags } from "@/contexts/FlagContext";

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
  events,
}: ExploreSceneProps & { events?: SceneEvent[] }) {
  const { player, playerClass, setMap, setPosition, setMode } = usePlayer();
  const { pushControls, popControls } = useGameControls();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, addItem, removeItem } = useInventory();
  const { quests, addQuest, updateProgress } = useQuests();
  const { setFlag, hasFlag } = useFlags();
  const lastPage = location.state?.from;

  useEffect(() => {
    saveGame({
      lastRoute: location.pathname,
      inventory: items,
      quests,
      playerClass,
      character: player.character,
    });
  }, [location.pathname, items, quests, playerClass, player.character]);

  function checkCondition(condition: any) {
    if (condition.hasQuest && !quests.some(q => q.id === condition.hasQuest)) {
      return false;
    }

    if (condition.notHasQuest && quests.some(q => q.id === condition.notHasQuest)) {
      return false;
    }

    if (condition.hasItem && !items.some(i => i.id === condition.hasItem)) {
      return false;
    }

    if (condition.notHasItem && items.some(i => i.id === condition.notHasItem)) {
      return false;
    }

    if (condition.lastPage && lastPage !== condition.lastPage) {
      return false;
    }

    if (condition.notLastPage && lastPage === condition.notLastPage) {
      return false;
    }

    if (condition.hasFlag && !hasFlag(condition.hasFlag)) {
      return false;
    }

    if (condition.notHasFlag && hasFlag(condition.notHasFlag)) {
      return false;
    }

    return true;
  }

  function runEvent(event: SceneEvent) {
    switch (event.type) {
      case "navigate":
        setTimeout(() => navigate(event.to), 0);
        return;

      case "setFlag":
        setFlag(event.flag);
        return;

      case "giveQuest":
        // você precisa ter isso no contexto
        const questData = QUESTS[event.questId];
        if (!questData) {
          console.warn("Quest não encontrada:", event.questId);
          return;
        }

        addQuest(questData);
        return;

      case "addItem":
        const itemData = ITEMS[event.itemId];

        if (!itemData) {
          console.warn("Item não encontrado:", event.itemId);
          return;
        }

        addItem(itemData);
        return;

      case "removeItem":
        removeItem(event.itemId);
        return;

      case "progressQuest":
        updateProgress(event.id, event.value);
        return;

      case "conditional":
        if (checkCondition(event.condition)) {
          event.then.forEach(runEvent);
        } else if (event.else) {
          event.else.forEach(runEvent);
        }
      return;
    }
  }

  const handleFinish = () => {
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
      navigate(nextRoute);
    }
  };

  const resolvedDialogueData =
  typeof dialogueData === "function"
    ? dialogueData(quests, items, lastPage)
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
      const npc = npcs.find(
        (n) => n.gridX === front.x && n.gridY === front.y
      );

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