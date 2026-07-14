import { usePlayer } from "@/contexts/PlayerContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useGameLayout } from "@/hooks/game/useGameLayout";
import { GameMap } from "@/components/Game/Map/Game";
import { Player } from "@/components/Game/Player";
import { NPC } from "@/components/Game/Npc";
import { Plate } from "@/components/Game/Plate";
import { QuestArrow, QuestNPCBadge, QuestDirectionArrow } from "@/components/Game/Quest/Indicator";
import Talking from "@/components/Talking";
import { useDialogue } from "@/hooks/interaction/useDialogue";
import { useSansTalking } from "@/hooks/interaction/useSansTalking";
import { useEffect, useMemo, useRef } from "react";

import { useSceneNavigation } from "@/hooks/scene/useNavigation";
import { useSceneSetup } from "@/hooks/scene/useSetup";
import { useSceneControls } from "@/hooks/scene/useControls";
import { useSceneInteraction } from "@/hooks/scene/useInteraction";
import { useSceneAudio } from "@/hooks/scene/useAudio";
import { useLocation } from "react-router";
import { useTransitionCtx } from "@/contexts/TransitionContext";
import { getTileInFront } from "@/utils/getTileInFront";
import { saveGame } from "@/utils/save/saveGame";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { useFlags } from "@/contexts/FlagContext";
import { asset } from "@/utils/paths";
import { InteractionPrompt } from "@/components/Game/InteractionPrompt";

type QuestHighlightTile = { x: number; y: number };
type QuestNpcPosition = { gridX: number; gridY: number };

export function ExploreScene({
  map,
  dialogueData = [],
  initialPosition,
  npcs = [],
  plates = [],
  audio,
  transitions,
  onInteract,
  autoStartDialogue,
  onFinish,
  nextRoute,
  className,
  setPopup,
  popup,
  questHighlightTiles,
  questNpcPositions,
  questDirection,
  itemPickupTiles,
  interactionKeys,
  tileDialogues,
  npcOverlays,
}: ExploreSceneProps & {
  events?: SceneEvent[];
  setPopup?: (msg: string | null) => void;
  popup?: string | null;
  questHighlightTiles?: QuestHighlightTile[];
  questNpcPositions?: QuestNpcPosition[];
  questDirection?: Direction | null;
  itemPickupTiles?: { x: number; y: number; visible: boolean }[];
  interactionKeys?: string[];
  tileDialogues?: Record<string, Dialogue[]>;
  npcOverlays?: { gridX: number; gridY: number; element: React.ReactNode }[];
}) {
  const { player, playerClass, setMap, setPosition, setMode } = usePlayer();
  const { pushControls, popControls } = useGameControls();
  const { navigateWithFade } = useTransitionCtx();
  const location = useLocation();
  const { items } = useInventory();
  const { quests } = useQuests();
  const { flags } = useFlags();
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

  const handleFinish = () => {
    setTimeout(() => {
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

      // 🔥 se popup ativo, fecha ao interagir
      if (popup) {
        setPopup?.(null);
        return true;
      }

      // 🔥 verifica NPC na frente
      const npc = npcs.find((n) => n.gridX === front.x && n.gridY === front.y);

      if (npc?.interaction) {
        npc.interaction(dialogueSystem.start);
        return true;
      }

      // 🔥 verifica tileDialogue na frente
      const tileDialogue = tileDialogues?.[`${front.x},${front.y}`];
      if (tileDialogue) {
        dialogueSystem.start(tileDialogue);
        return true;
      }

      // 🔥 verifica placa na frente
      const plate = plates.find((p) => p.gridX === front.x && p.gridY === front.y);

      if (plate?.message) {
        setPopup?.(plate.message);
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
      if (!dialogueSystem.nextSoundSrc) {
        playSansTalking();
      }
    }
  }, [autoStartDialogue, dialogueSystem, playSansTalking]);

  const frontTile = useMemo(() => {
    if (!isReady) return null;
    return getTileInFront(player, map);
  }, [player, map, isReady]);

  const interactionHint = useMemo(() => {
    if (!frontTile) return null;

    const { x, y } = frontTile;

    const npc = npcs.find((n) => n.gridX === x && n.gridY === y);
    if (npc) return "[L] Conversar";

    const pickup = itemPickupTiles?.find(
      (t) => t.x === x && t.y === y && t.visible,
    );
    if (pickup) return "[L] Pegar";

    const plate = plates.find((p) => p.gridX === x && p.gridY === y);
    if (plate) return "[L] Interagir";

    if (interactionKeys?.includes(`${x},${y}`)) return "[L] Interagir";

    if (tileDialogues?.[`${x},${y}`]) return "[L] Interagir";

    return null;
  }, [frontTile, npcs, itemPickupTiles, plates, interactionKeys, tileDialogues]);

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

        {npcOverlays?.map((overlay, i) => (
          <div
            key={`overlay-${i}`}
            style={{
              position: "absolute",
              left: overlay.gridX * TILE_SIZE - 40 + (TILE_SIZE * 1.7) / 2,
              top: overlay.gridY * TILE_SIZE - 80,
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            {overlay.element}
          </div>
        ))}

        {questNpcPositions?.map((pos) => (
          <QuestNPCBadge
            key={`quest-npc-${pos.gridX}-${pos.gridY}`}
            gridX={pos.gridX}
            gridY={pos.gridY}
            TILE_SIZE={TILE_SIZE}
          />
        ))}

        {questHighlightTiles?.map((tile) => (
          <QuestArrow
            key={`quest-arrow-${tile.x}-${tile.y}`}
            x={tile.x}
            y={tile.y}
            TILE_SIZE={TILE_SIZE}
          />
        ))}

        {plates.map((plate) => (
          <Plate
            key={`plate-${plate.gridX}-${plate.gridY}`}
            {...plate}
            TILE_SIZE={TILE_SIZE}
          />
        ))}

        {itemPickupTiles?.map(
          (tile) =>
            tile.visible && (
              <img
                key={`item-${tile.x}-${tile.y}`}
                src={asset("/assets/items/chests/default.svg")}
                alt=""
                style={{
                  position: "absolute",
                  width: TILE_SIZE * 0.7,
                  height: TILE_SIZE * 0.7,
                  left: tile.x * TILE_SIZE,
                  top: tile.y * TILE_SIZE * 1.1,
                  zIndex: 5,
                  pointerEvents: "none",
                }}
              />
            ),
        )}

        <Player
          character={player.character}
          direction={player.direction}
          gridX={player.gridX}
          gridY={player.gridY}
          TILE_SIZE={TILE_SIZE}
          PLAYER_SIZE={PLAYER_SIZE}
          hasPeru={player.hasPeru}
          moving={player.moving}
        />

        {questDirection && (
          <QuestDirectionArrow
            gridX={player.gridX}
            gridY={player.gridY}
            TILE_SIZE={TILE_SIZE}
            PLAYER_SIZE={PLAYER_SIZE}
            direction={questDirection}
          />
        )}
      </GameMap>

      {interactionHint && !dialogueSystem.isOpen && (
        <InteractionPrompt text={interactionHint} />
      )}

      {dialogueSystem.isOpen && <Talking {...dialogueSystem.dialogue} onSoundEnd={dialogueSystem.next} />}
    </div>
  );
}
