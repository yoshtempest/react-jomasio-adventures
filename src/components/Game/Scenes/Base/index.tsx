import { useEffect } from "react";
import {
  useLocation,
  type NavigateFunction,
  type Location,
} from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useTransitionCtx } from "@/contexts/TransitionContext";
import { useFlags } from "@/contexts/FlagContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { runSceneEvents } from "@/engine/runSceneEvents";
import { useQuestActions } from "@/hooks/quest/useQuestActions";
import { useQuests } from "@/contexts/QuestContext";
import { MapOverlay } from "@/components/Game/Map/Menu";
import { QUESTS } from "@/data/quests";
import { ITEMS } from "@/data/items";
import { useExitTile } from "@/hooks/scene/useExitTile";
import { useQuestWaypoints } from "@/hooks/quest/useQuestWaypoints";
import { canStepTo } from "@/gameRules/movement/levels";
import { isPositionInFront, parseGridKey } from "@/utils/isPositionInFront";
import type { ItemPickupTile } from "@/utils/types/maps/exploreScene";

function findInteraction(
  interactions: Record<string, () => void> | undefined,
  player: Player,
  frontX: number,
  frontY: number,
) {
  if (!interactions) return undefined;

  const exact = interactions[`${frontX},${frontY}`];
  if (exact) return exact;

  let best: { key: string; dist: number } | null = null;
  for (const key in interactions) {
    const pos = parseGridKey(key);
    if (!pos || !isPositionInFront(player, pos.x, pos.y)) continue;
    const dist = (pos.x - frontX) ** 2 + (pos.y - frontY) ** 2;
    if (!best || dist < best.dist) best = { key, dist };
  }
  return best ? interactions[best.key] : undefined;
}

type SceneBaseProps = {
  scene: SceneConfig;
  className?: string;
  background?: string;

  interactions?: Record<string, () => void>;
  itemPickupTiles?: ItemPickupTile[];
  interactionLabels?: Record<string, string>;
  popup?: string | null;
  setPopup?: (msg: string | null) => void;

  handleExit?: (ctx: {
    player: Player;
    scene: SceneConfig;
    navigate: NavigateFunction;
    location: Location;
    quests: Quest[];
  }) => boolean;
  onFinishExtra?: (ctx: {
    navigate: NavigateFunction;
    location: Location;
  }) => Record<string, unknown> | void;
  tileDialogues?: Record<string, Dialogue[]>;
  npcOverlays?: { gridX: number; gridY: number; element: React.ReactNode }[];
  children?: React.ReactNode;
};

export function SceneBase({
  scene,
  className,
  background,
  interactions,
  itemPickupTiles,
  interactionLabels,
  popup,
  setPopup,
  handleExit,
  onFinishExtra,
  tileDialogues,
  npcOverlays,
  children,
}: SceneBaseProps) {
  const { navigateWithFade } = useTransitionCtx();
  const location = useLocation();
  const { player, setMode, setPosition } = usePlayer();
  const { quests } = useQuests();
  const { hasFlag } = useFlags();
  const { hasItem, addItem, removeItem } = useInventory();
  const { closeNavbar } = useNavbar();
  const { giveQuest, progressQuest } = useQuestActions();

  const lastPage = location.state?.from;

  const currentRoute = location.pathname;

  const { highlightTiles, questNpcPositions, questDirection } =
    useQuestWaypoints(scene, currentRoute);

  const spawn = scene
    ? typeof scene.initialPosition === "function"
      ? scene.initialPosition(lastPage)
      : scene.initialPosition
    : undefined;

  useExitTile({
    scene,
    player,
    quests,
    navigateWithFade,
    location,
    handleExit,
    setPopup,
    popup,
    setPosition,
  });

  useEffect(() => {
    closeNavbar();
    setMode("explore");
  }, [closeNavbar, setMode]);

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <div
      className={`Master ${className ?? ""}`}
    >
      <div className="SceneMap">
        <ExploreScene
          key={scene.id}
          {...scene}
          background={background}
          initialPosition={spawn}
          lastPage={lastPage}
          setPopup={setPopup}
          popup={popup}
          questHighlightTiles={highlightTiles}
          questNpcPositions={questNpcPositions}
          questDirection={questDirection}
          itemPickupTiles={itemPickupTiles}
          interactionKeys={Object.keys(interactions ?? {})}
          interactionLabels={interactionLabels}
          tileDialogues={tileDialogues}
          npcOverlays={npcOverlays}
          cutscene={scene.cutscene}
          onFinish={() => {
            const extra = onFinishExtra?.({
              navigate: navigateWithFade,
              location,
            });

            runSceneEvents(scene.events, {
              ...extra,
              navigate: navigateWithFade,
              location,
              hasQuest: (questId) => quests.some((q) => q.id === questId),
              hasFlag,
              hasItem,
              addItem: (itemId) => {
                const item = ITEMS[itemId as ItemId];
                if (item) addItem(item);
              },
              removeItem: (itemId) => {
                removeItem(itemId as ItemId);
              },
              giveQuest: (questId) => {
                const quest = QUESTS[questId];
                if (!quest) return;

                giveQuest(quest);
              },
              progressQuest,
            });
          }}
          onInteract={(_, x, y) => {
            if (popup) {
              setPopup?.(null);
              return true;
            }

            if (!canStepTo(player.height, scene.heightMap, x, y)) {
              return false;
            }

            const interaction = findInteraction(interactions, player, x, y);
            if (interaction) {
              interaction();
              return true;
            }

            return false;
          }}
        />
      </div>

      {player.mode === "map" && (
        <MapOverlay currentRoute={currentRoute} character={player.character} />
      )}

      {popup && <div className="SceneOverlay">{children}</div>}
    </div>
  );
}
