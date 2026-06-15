import { useMemo, useState } from "react";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { CAFETERIA_SCENES } from "@/scenes/cafeteria";
import { createCafeteria } from "@/interactions/cafeteira";

import { useInventory } from "@/contexts/InventoryContext";
import { useQuestActions } from "@/hooks/useQuestActions";

import Talking from "@/components/Talking";

type Props = {
  sceneId: SceneId;
};

export function CafeteriaScene({ sceneId }: Props) {
  const scene = CAFETERIA_SCENES[sceneId];

  const { addItem, hasItem, removeItem } = useInventory();
  const { progressQuest } = useQuestActions();

  const [popup, setPopup] = useState<string | null>(null);
  const [gotKey, setGotKey] = useState(false);

  // ✅ interações específicas da cafeteria
  const interactions = useMemo(
    () =>
      createCafeteria({
        hasItem,
        addItem,
        removeItem,
        setPopup,
        gotKey,
        setGotKey,
        progressQuest,
      }),
    [addItem, gotKey, hasItem, removeItem, setPopup, setGotKey, progressQuest],
  );

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        className="Master Cafeteria"
        interactions={interactions}
        popup={popup}
        setPopup={setPopup}
      />

      {/* ✅ popup continua fora */}
      {popup && <Talking name="Sistema" message={popup} />}
    </>
  );
}
