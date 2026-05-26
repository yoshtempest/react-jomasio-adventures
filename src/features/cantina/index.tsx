import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { CANTINA_SCENES } from "@/scenes/cantina";
import { createCantina } from "@/interactions/cantina";

import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import type { SceneId } from "@/utils/types/maps/sceneConfig";

import Talking from "@/components/Talking";

type Props = {
  sceneId: SceneId;
};

export function CantinaScene({ sceneId }: Props) {
  const scene = CANTINA_SCENES[sceneId];

  const location = useLocation();
  const navigate = useNavigate();

  const { quests } = useQuests();
  const { addItem } = useInventory();

  const [popup, setPopup] = useState<string | null>(null);
  const [gotKey, setGotKey] = useState(false);

  // ✅ interações específicas da cantina
  const interactions = useMemo(
    () =>
      createCantina({
        addItem,
        setPopup,
        gotKey,
        setGotKey,
      }),
    [addItem, gotKey]
  );

  return (
    <>
      <SceneBase
        scene={scene}
        className="Master Cantina"
        interactions={interactions}
        popup={popup}
        setPopup={setPopup}

        // 🔥 AQUI fica a lógica especial da Cantina
        handleExit={({ player, scene }) => {
          const exits = scene.exitTile;
          if (!exits) return false;

          const matchedExit = exits.find(
            (exit: any) =>
              player.gridX === exit.x &&
              player.gridY === exit.y
          );

          if (matchedExit) {
            if (matchedExit.requiredQuest) {
              const hasQuest = quests.some(
                (q) => q.id === matchedExit.requiredQuest
              );

              if (!hasQuest) {
                setPopup(
                  matchedExit.blockedMessage ||
                    "Você não pode ir agora."
                );
                return true; // 🚨 bloqueia
              }
            }

            navigate(matchedExit.route, {
              state: { from: location.pathname },
            });

            return true;
          }

          return false;
        }}
      />

      {/* ✅ popup continua fora do SceneBase */}
      {popup && (
        <Talking
          name="Sistema"
          message={popup}
        />
      )}
    </>
  );
}