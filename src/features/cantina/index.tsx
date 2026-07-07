import { useMemo, useState } from "react";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { CANTINA_SCENES } from "@/scenes/cantina";
import { createCantina } from "@/interactions/cantina";

import { useInventory } from "@/contexts/InventoryContext";

import { cantinaBrothersDialogue } from "@/data/dialogues/cantina/brothers";
import { sceneBackgrounds } from "@/data/sceneBackground";

import Talking from "@/components/Talking";
import { JesoFoodBadge } from "@/components/Game/JesoFoodBadge";
import { cantinaJesoDialogue } from "@/data/dialogues/cantina/jeso";
import { cantinaJesoTwoDialogue } from "@/data/dialogues/cantina/jesoTwo";
import { useJesoFoodCooldown } from "@/hooks/useJesoFoodCooldown";

type Props = {
  sceneId: SceneId;
};

export function CantinaScene({ sceneId }: Props) {
  const scene = CANTINA_SCENES[sceneId];
  const { addItem } = useInventory();
  const { isReady, giveFood } = useJesoFoodCooldown();

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
    [addItem, gotKey],
  );

  const sceneWithJeso = useMemo(() => {
    if (!scene) return null;
    return {
      ...scene,
      npcs: (scene.npcs ?? []).map((npc) =>
        npc.gridX === 9 && npc.gridY === 4
          ? {
              ...npc,
              interaction: (startDialogue: (d: Dialogue[]) => void) => {
                if (isReady) {
                  const foods = giveFood();
                  for (const id of foods) {
                    addItem({ id: id as ItemId });
                  }
                  startDialogue(cantinaJesoDialogue);
                } else {
                  startDialogue(cantinaJesoTwoDialogue);
                }
              },
            }
          : npc,
      ),
    };
  }, [scene, isReady, giveFood, addItem]);

  if (!scene || !sceneWithJeso) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={sceneWithJeso}
        className="Master Cantina"
        background={sceneBackgrounds.Cantina}
        interactions={interactions}
        itemPickupTiles={[{ x: 13, y: 4, visible: !gotKey }]}
        popup={popup}
        setPopup={setPopup}
        tileDialogues={{
          "15,3": cantinaBrothersDialogue,
        }}
        npcOverlays={[
          { gridX: 9, gridY: 4, element: <JesoFoodBadge /> },
        ]}
      />

      {/* ✅ popup continua fora do SceneBase */}
      {popup && <Talking name="Sistema" message={popup} />}
    </>
  );
}
