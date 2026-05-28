import { useMemo, useState } from "react";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { DIRECTOR_SCENES } from "@/scenes/director";
import { createDirector } from "@/interactions/director";

import { useInventory } from "@/contexts/InventoryContext";
import { useQuestActions } from "@/hooks/useQuestActions";
import type { SceneId } from "@/utils/types/maps/sceneConfig";

import Talking from "@/components/Talking";

type Props = {
  sceneId: SceneId;
};

export function DirectorScene({ sceneId }: Props) {
  const scene = DIRECTOR_SCENES[sceneId];

  const { addItem, hasItem, removeItem } = useInventory();
  const { progressQuest } = useQuestActions();

  const [popup, setPopup] = useState<string | null>(null);
  const [gotKey, setGotKey] = useState(false);

  const interactions = useMemo(
    () =>
      createDirector({
        hasItem,
        addItem,
        removeItem,
        setPopup,
        gotKey,
        setGotKey,
        progressQuest,
      }),
    [addItem, gotKey]
  );

  return (
    <>
      <SceneBase
        scene={scene}
        className="Master Director"
        interactions={interactions}
        popup={popup}
        setPopup={setPopup}
      />

      {/* ✅ popup continua fora */}
      {popup && (
        <Talking
          name="Sistema"
          message={popup}
        />
      )}
    </>
  );
}