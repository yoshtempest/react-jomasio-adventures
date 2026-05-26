import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { runSceneEvents } from "@/engine/runSceneEvents";
import { useQuestActions } from "@/hooks/useQuestActions";
import { useQuests } from "@/contexts/QuestContext";

type SceneBaseProps = {
  scene: any;
  className?: string;

  interactions?: Record<string, () => void>;
  popup?: string | null;
  setPopup?: (msg: string | null) => void;

  handleExit?: (ctx: any) => boolean;
  onFinishExtra?: (ctx: any) => Record<string, any> | void;
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
  const navigate = useNavigate();
  const location = useLocation();
  const { player } = usePlayer();
  const { quests } = useQuests();
  const { giveQuest, progressQuest } = useQuestActions();

  const lastPage = location.state?.from;

  const spawn = scene
    ? typeof scene.initialPosition === "function"
      ? scene.initialPosition(lastPage)
      : scene.initialPosition
    : undefined;

  // ✅ EXIT TILE (com override)
  useEffect(() => {
    if (!scene) return;

    // 🔥 override (Cantina ainda pode usar)
    if (handleExit?.({ player, scene, navigate, location, quests })) {
      return;
    }

    const tile = scene.tiles?.find(
      (t: any) =>
        player.gridX === t.x &&
        player.gridY === t.y
    );

    if (!tile) return;

    // 🧠 1. rota dinâmica
    if (tile.getRoute) {
      const route = tile.getRoute(player, quests);

      if (route !== null) {
        navigate(route, {
          state: { from: location.pathname },
        });
      } else {
        setPopup?.(
          tile.blockedMessage || "Você não pode ir agora."
        );
      }

      return;
    }

    // 🧠 2. valida quest
    if (tile.requiredQuest) {
      const hasQuest = quests.some(
        (q) => q.id === tile.requiredQuest
      );

      if (!hasQuest) {
        setPopup?.(
          tile.blockedMessage || "Você não pode ir agora."
        );
        return;
      }
    }

    // 🧠 3. rota simples
    if (tile.route) {
      navigate(tile.route, {
        state: { from: location.pathname },
      });
    }
  }, [player, scene, quests]);



  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <div className={`Master ${className}`}>
      <div className="SceneMap">
        <ExploreScene
          {...scene}
          initialPosition={spawn}
          lastPage={lastPage}
          onFinish={() => {
            const extra = onFinishExtra?.({
              navigate,
              location,
            });

            runSceneEvents(scene.events, {
              navigate,
              location,
              giveQuest,
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

            return false;
          }}
        />
      </div>

      {popup && (
        <div className="SceneOverlay">
          {children}
        </div>
      )}
    </div>
  );
}