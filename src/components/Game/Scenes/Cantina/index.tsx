import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { CANTINA_SCENES } from "@/scenes/Cantina";
import type { SceneId } from "@/utils/types/maps/sceneConfig";
import { runSceneEvents } from "@/engine/runSceneEventsCantina";
import { createCantina } from "@/interactions/cantina";
import { useInventory } from "@/contexts/InventoryContext";
import Talking from "@/components/Talking";
import { useQuestActions } from "@/hooks/useQuestActions";
import { useQuests } from "@/contexts/QuestContext";


type Props = {
  sceneId: SceneId;
};

export function CantinaScene({ sceneId }: Props) {
  const scene = CANTINA_SCENES[sceneId];
  const { quests } = useQuests();
  const [shouldRunEvents, setShouldRunEvents] = useState(false);
  const { giveQuest, progressQuest } = useQuestActions();

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  const navigate = useNavigate();
  const { player } = usePlayer();

  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem } = useInventory();
  const [gotKey, setGotKey] = useState(false);

    const interactionsByPosition = useMemo(() =>
      createCantina({
        hasItem,
        addItem,
        setPopup,
        gotKey,
        setGotKey,
      }),
      [hasItem, addItem, gotKey]
    );

  // 🚪 exit tile (genérico e seguro)
  useEffect(() => {
    const exits = scene.exitTile;
    if (!exits) return;

    const matchedExit = exits.find(
      (exit) =>
        player.gridX === exit.x &&
        player.gridY === exit.y
    );

    if (matchedExit) {
      if (matchedExit.requiredQuest) {
        const hasQuest = quests.some(
          q => q.id === matchedExit.requiredQuest
        );

        if (!hasQuest) {
          setPopup(matchedExit.blockedMessage || "Você não pode ir agora.");
          return; // 🚫 BLOQUEIA
        }
      }
      navigate(matchedExit.route);
    }
  }, [player, scene]);

  useEffect(() => {
    if (!shouldRunEvents) return;

    runSceneEvents(scene.events, {
      navigate,
      giveQuest,
      progressQuest,
    });

    setShouldRunEvents(false);
  }, [shouldRunEvents]);

  return (
    <div className={`Master Cantina`}>
      <ExploreScene
        {...scene}
        onFinish={() => {
          setShouldRunEvents(true);
        }}
        onInteract={(_, x, y) => {
          if (popup) {
            setPopup(null);
            return true;
          }

          const interaction = interactionsByPosition[`${x},${y}`];
          if (interaction) {
            interaction();
            return true;
          }

          return false;
        }}
      />
      {popup && (
        <Talking
          name="Sistema"
          message={popup}
        />
      )}
    </div>
  );
}