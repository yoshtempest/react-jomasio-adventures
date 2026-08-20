import { usePlayer } from "@/contexts/PlayerContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useGameLayout } from "@/hooks/game/useGameLayout";
import { GameMap } from "@/components/Game/Map/Game";
import { Player } from "@/components/Game/Player";
import { NPC } from "@/components/Game/Npc";
import { Plate } from "@/components/Game/Plate";
// import { LevelSteps } from "@/components/Game/LevelSteps";
import { HEIGHT_STEP_OFFSET } from "@/gameRules/movement/levels";
import {
  QuestArrow,
  QuestNPCBadge,
  QuestDirectionArrow,
} from "@/components/Game/Quest/Indicator";
import Talking from "@/components/Talking";
import { useDialogue } from "@/hooks/interaction/useDialogue";
import { useGoodPowderEncounter } from "@/hooks/interaction/useGoodPowderEncounter";
import { useSansTalking } from "@/hooks/interaction/useSansTalking";
import { useEffect, useMemo, useRef, useState } from "react";

import { useSceneNavigation } from "@/hooks/scene/useNavigation";
import { useSceneSetup } from "@/hooks/scene/useSetup";
import { useSceneControls } from "@/hooks/scene/useControls";
import { useSceneInteraction } from "@/hooks/scene/useInteraction";
import { useSceneAudio } from "@/hooks/scene/useAudio";
import { useSceneLayers } from "@/hooks/scene/useSceneLayers";
import { useLocation } from "react-router";
import { useTransitionCtx } from "@/contexts/TransitionContext";
import { getTileInFront } from "@/utils/getTileInFront";
import { isNpcInFront } from "@/utils/isNpcInFront";
import { saveGame } from "@/utils/save/saveGame";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { useFlags } from "@/contexts/FlagContext";
import { asset } from "@/utils/paths";
import { InteractionPrompt } from "@/components/Game/InteractionPrompt";
import { CutsceneVideo } from "@/components/Game/Cutscene";
import type { ItemPickupTile } from "@/utils/types/maps/exploreScene";

type QuestHighlightTile = { x: number; y: number };
type QuestNpcPosition = { gridX: number; gridY: number };

export function ExploreScene({
  map,
  heightMap,
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
  interactionLabels,
  tileDialogues,
  npcOverlays,
  cutscene,
  background,
  backgroundSize,
  scaleFix,
}: ExploreSceneProps & {
  background?: string;
  backgroundSize?: string;
  scaleFix?: number;
  events?: SceneEvent[];
  setPopup?: (msg: string | null) => void;
  popup?: string | null;
  questHighlightTiles?: QuestHighlightTile[];
  questNpcPositions?: QuestNpcPosition[];
  questDirection?: Direction | null;
  itemPickupTiles?: ItemPickupTile[];
  interactionKeys?: string[];
  interactionLabels?: Record<string, string>;
  tileDialogues?: Record<string, Dialogue[]>;
  npcOverlays?: { gridX: number; gridY: number; element: React.ReactNode }[];
  cutscene?: SceneCutscene;
}) {
  const { player, playerClass, setMap, setHeightMap, setPosition, setMode } =
    usePlayer();
  const { pushControls } = useGameControls();
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

  const [cutsceneActive, setCutsceneActive] = useState(false);
  const cutsceneDoneRef = useRef(false);

  const finishScene = () => {
    setTimeout(() => {
      if (onFinish) onFinish();

      if (nextRoute) {
        navigateWithFade(nextRoute, { state: { from: location.pathname } });
      }
    }, 0);
  };

  const handleFinish = () => {
    if (cutscene) {
      cutsceneDoneRef.current = false;
      setCutsceneActive(true);
      return;
    }
    finishScene();
  };

  const handleCutsceneEnd = () => {
    if (cutsceneDoneRef.current) return;
    cutsceneDoneRef.current = true;
    setCutsceneActive(false);
    finishScene();
  };

  const handleCutsceneEndRef = useLatestRef(handleCutsceneEnd);

  useEffect(() => {
    if (!cutsceneActive) return;

    const timeout = setTimeout(() => handleCutsceneEndRef.current(), 4000);
    return () => clearTimeout(timeout);
  }, [cutsceneActive, handleCutsceneEndRef]);

  useEffect(() => {
    if (!cutsceneActive) return;

    const remove = pushControls({
      onUp: () => true,
      onDown: () => true,
      onLeft: () => true,
      onRight: () => true,
      onConfirm: () => true,
      onCancel: () => true,
    });

    return remove;
  }, [cutsceneActive, pushControls]);

  const npcContext = { quests, items, flags, character: player.character, lastPage };

  const resolvedDialogueData =
    typeof dialogueData === "function"
      ? dialogueData(npcContext)
      : dialogueData;

  const dialogueSystem = useDialogue(resolvedDialogueData, handleFinish);
  const { play: playSansTalking } = useSansTalking(dialogueSystem.isOpen);
  const hasStarted = useRef(false);

  const resolvedNpcs = useMemo(
    () =>
      npcs.map((npc) => ({
        ...npc,
        src: typeof npc.src === "function"
          ? npc.src({ ...npcContext, dialogueIndex: dialogueSystem.index })
          : npc.src,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [npcs, flags, quests, items, player.character, lastPage, dialogueSystem.index],
  );

  const resolvedInitialPosition =
    typeof initialPosition === "function"
      ? initialPosition(lastPage) // ⚠️ aqui falta o lastPage ainda
      : initialPosition;

  const resolvedAutoStartDialogue =
    typeof autoStartDialogue === "function"
      ? autoStartDialogue(npcContext)
      : autoStartDialogue;

  const { isReady } = useSceneSetup({
    map,
    heightMap,
    initialPosition: resolvedInitialPosition,
    setMap,
    setHeightMap,
    setPosition,
  });

  const { encounterNpc } = useGoodPowderEncounter({
    map,
    isReady,
    dialogueSystem,
    navigateWithFade,
  });

  useSceneNavigation({
    player,
    transitions,
  });

  useSceneControls({
    pushControls,
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

      // 🔥 verifica NPC na frente (posições fracionadas X.5/Y.5 inclusas)
      const npc = resolvedNpcs.find((n) => isNpcInFront(player, n));

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
      const plate = plates.find(
        (p) => p.gridX === front.x && p.gridY === front.y,
      );

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
    if (resolvedAutoStartDialogue && !hasStarted.current) {
      hasStarted.current = true;
      dialogueSystem.start();
      if (!dialogueSystem.nextSoundSrc) {
        playSansTalking();
      }
    }
  }, [resolvedAutoStartDialogue, dialogueSystem, playSansTalking]);

  const { interactionHint } = useSceneLayers({
    player,
    map,
    heightMap,
    isReady,
    npcs: resolvedNpcs,
    itemPickupTiles,
    plates,
    interactionKeys,
    interactionLabels,
    tileDialogues,
  });

  const { TILE_SIZE, cameraX, cameraY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } =
    useGameLayout(map, scaleFix);

  if (!isReady) return null;

  return (
    <div className={className}>
      <GameMap
        TILE_SIZE={TILE_SIZE}
        cols={MAP_COLS}
        rows={MAP_ROWS}
        cameraX={cameraX}
        cameraY={cameraY}
        backgroundUrl={background}
        backgroundSize={backgroundSize}
      >
        {resolvedNpcs.map((npc) => (
          <NPC
            key={`${npc.gridX},${npc.gridY}`}
            {...npc}
            TILE_SIZE={TILE_SIZE}
            fading={
              cutsceneActive &&
              cutscene !== undefined &&
              npc.gridX === cutscene.npcGridX &&
              npc.gridY === cutscene.npcGridY
            }
          />
        ))}

        {encounterNpc && (
          <NPC
            key={`encounter-${encounterNpc.gridX}-${encounterNpc.gridY}`}
            {...encounterNpc}
            TILE_SIZE={TILE_SIZE}
          />
        )}

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

        {cutsceneActive &&
          cutscene !== undefined &&
          (() => {
            const videoWidth = TILE_SIZE * 2.2;
            const videoHeight = (videoWidth * 9) / 16;
            const npcCenterX =
              cutscene.npcGridX * TILE_SIZE - 40 + (TILE_SIZE * 1.7) / 2;
            const npcCenterY =
              cutscene.npcGridY * TILE_SIZE - 20 + (TILE_SIZE * 1.7) / 2;

            return (
              <div
                style={{
                  position: "absolute",
                  left: npcCenterX - videoWidth / 2,
                  top: npcCenterY - videoHeight / 2,
                  zIndex: 30,
                  pointerEvents: "none",
                }}
              >
                <CutsceneVideo
                  src={asset(cutscene.videoSrc)}
                  width={videoWidth}
                  height={videoHeight}
                  onEnded={handleCutsceneEnd}
                />
              </div>
            );
          })()}

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
                src={
                  tile.image
                    ? asset(tile.image)
                    : asset("/assets/items/chests/default.svg")
                }
                alt=""
                style={{
                  position: "absolute",
                  width: TILE_SIZE * 0.7,
                  height: TILE_SIZE * 0.7,
                  left: tile.x * TILE_SIZE,
                  top:
                    tile.y * TILE_SIZE * 1.1 -
                    (tile.height ?? 0) * TILE_SIZE * HEIGHT_STEP_OFFSET,
                  zIndex: 5,
                  pointerEvents: "none",
                }}
              />
            ),
        )}

        {/* <LevelSteps heightMap={heightMap} TILE_SIZE={TILE_SIZE} /> */}

        <Player
          character={player.character}
          direction={player.direction}
          gridX={player.gridX}
          gridY={player.gridY}
          height={player.height}
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

      {dialogueSystem.isOpen && dialogueSystem.dialogue && (
        <Talking
          {...dialogueSystem.dialogue}
          onSoundEnd={dialogueSystem.next}
        />
      )}
    </div>
  );
}
