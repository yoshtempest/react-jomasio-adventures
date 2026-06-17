import { useMemo, useRef } from "react";
import {
  useLocation,
  type NavigateFunction,
  type Location,
} from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useTransitionCtx } from "@/contexts/TransitionContext";
import { useFlags } from "@/contexts/FlagContext";
import { useInventory } from "@/contexts/InventoryContext";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { runSceneEvents } from "@/engine/runSceneEvents";
import { useQuestActions } from "@/hooks/useQuestActions";
import { useQuests } from "@/contexts/QuestContext";
import { MapOverlay } from "@/components/Game/MenuMap";
import { QUESTS } from "@/data/quests";
import { getSceneName, autoSigns } from "@/scenes/shared/signs";
import { useExitTile } from "@/hooks/scene/useExitTile";

type SceneBaseProps = {
  scene: SceneConfig;
  className?: string;

  interactions?: Record<string, () => void>;
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
  children?: React.ReactNode;
};

export function SceneBase({
  scene,
  className,
  interactions,
  popup,
  setPopup,
  handleExit,
  onFinishExtra,
  children,
}: SceneBaseProps) {
  const { navigateWithFade } = useTransitionCtx();
  const location = useLocation();
  const { player } = usePlayer();
  const { quests } = useQuests();
  const { hasFlag } = useFlags();
  const { hasItem } = useInventory();
  const { giveQuest, progressQuest } = useQuestActions();

  const lastPage = location.state?.from;
  const sceneName = scene.name ?? getSceneName(location.pathname);

  const setPopupRef = useRef(setPopup);
  setPopupRef.current = setPopup;

  const signs = useMemo(
    () =>
      scene.signs ??
      (scene.tiles ? autoSigns(scene.tiles, scene.map, sceneName) : []),
    [scene.tiles, scene.map, sceneName, scene.signs],
  );

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
  });

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <div className={`Master ${className}`}>
      <div className="SceneMap">
        <ExploreScene
          key={scene.id}
          {...scene}
          signs={signs}
          initialPosition={spawn}
          lastPage={lastPage}
          onFinish={() => {
            const extra = onFinishExtra?.({
              navigate: navigateWithFade,
              location,
            });

            runSceneEvents(scene.events, {
              navigate: navigateWithFade,
              location,
              hasQuest: (questId) => quests.some((q) => q.id === questId),
              hasFlag,
              hasItem,
              giveQuest: (questId) => {
                const quest = QUESTS[questId];
                if (!quest) return;

                giveQuest(quest);
              },
              progressQuest,
              ...extra,
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

            const sign = signs.find((s: SceneSign) => s.x === x && s.y === y);
            if (sign) {
              setPopupRef.current?.(sign.message);
              return true;
            }

            return false;
          }}
        />
      </div>

      {player.mode === "map" && (
        <MapOverlay
          map={scene.map}
          playerX={player.gridX}
          playerY={player.gridY}
        />
      )}

      {popup && <div className="SceneOverlay">{children}</div>}
    </div>
  );
}
