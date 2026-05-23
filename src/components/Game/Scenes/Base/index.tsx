import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { runSceneEvents } from "@/engine/runSceneEvents";
import { useQuestActions } from "@/hooks/useQuestActions";

type SceneBaseProps = {
  scene: any;
  className?: string;

  interactions?: Record<string, () => void>;
  popup?: string | null;
  setPopup?: (msg: string | null) => void;

  handleExit?: (ctx: any) => boolean;
  onFinishExtra?: (ctx: any) => Record<string, any> | void;
};

export function SceneBase({
  scene,
  className,
  interactions,
  popup,
  setPopup,
  handleExit,
  onFinishExtra,
}: SceneBaseProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { player } = usePlayer();
  const { giveQuest, progressQuest } = useQuestActions();

  const lastPage = location.state?.from;

  // ✅ SPAWN (vem do seu código)
  const spawn = scene
    ? typeof scene.initialPosition === "function"
      ? scene.initialPosition(lastPage)
      : scene.initialPosition
    : undefined;

  // ✅ EXIT TILE (com override)
  useEffect(() => {
    if (!scene) return;

    // 🔥 permite sobrescrever comportamento (Cantina, etc)
    if (handleExit?.({ player, scene, navigate, location })) {
      return;
    }

    const exits = scene.exitTile;
    if (!exits) return;

    const matchedExit = exits.find(
      (exit: any) =>
        player.gridX === exit.x &&
        player.gridY === exit.y
    );

    if (matchedExit) {
      navigate(matchedExit.route, {
        state: { from: location.pathname },
      });
    }
  }, [player, scene]);



  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <div className={`SceneRoot ${className}`}>
        {/* 🎮 MAPA */}
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

        {/* 🌑 OVERLAY */}
        {popup && (
            <div className="SceneOverlay">
            {/* não renderiza mapa aqui, só UI */}
            </div>
        )}
        </div>
  );
}