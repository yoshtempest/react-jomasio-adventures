import { useEffect, useRef } from "react";
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

type SceneBaseProps = {
  scene: SceneConfig;
  className?: string;
  background?: string;

  interactions?: Record<string, () => void>;
  itemPickupTiles?: { x: number; y: number; visible: boolean }[];
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

  const setPopupRef = useRef(setPopup);
  setPopupRef.current = setPopup;

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
          tileDialogues={tileDialogues}
          npcOverlays={npcOverlays}
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

            const interaction = interactions?.[`${x},${y}`];
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
