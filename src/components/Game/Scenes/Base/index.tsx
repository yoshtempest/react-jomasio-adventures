import { useEffect, useRef } from "react";
import { useNavigate, useLocation, type NavigateFunction, type Location } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { runSceneEvents } from "@/engine/runSceneEvents";
import { useQuestActions } from "@/hooks/useQuestActions";
import { useQuests } from "@/contexts/QuestContext";
import { MapOverlay } from "@/components/Game/MenuMap";
import { QUESTS } from "@/data/quests";
import type { SceneConfig, SceneTile } from "@/utils/types/maps/sceneConfig";
import type { Player } from "@/utils/types/player/player";
import type { Quest } from "@/utils/types/player/quest";

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

  // 🛡️ Pula primeira execução do efeito de saída após troca de cena,
  // pois o player ainda está com a posição defasada da cena anterior.
  // O useLayoutEffect do useSceneSetup roda depois e posiciona o jogador.
  const sceneInitRef = useRef(true);

  useEffect(() => {
    sceneInitRef.current = false;
  }, [scene]);

  // ✅ EXIT TILE (com override)
  useEffect(() => {
    if (!scene) return;

    if (!sceneInitRef.current) {
      sceneInitRef.current = true;
      return;
    }

    // 🔥 override (Cantina ainda pode usar)
    if (handleExit?.({ player, scene, navigate, location, quests })) {
      return;
    }

    const tile = scene.tiles?.find(
      (t: SceneTile) =>
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
  }, [player.gridX, player.gridY, scene, quests]);



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
              giveQuest: (questId) => {
                const quest = QUESTS[questId];
                if (!quest) return;

                giveQuest(quest); // agora sim: objeto → contexto
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

      {popup && (
        <div className="SceneOverlay">
          {children}
        </div>
      )}
    </div>
  );
}