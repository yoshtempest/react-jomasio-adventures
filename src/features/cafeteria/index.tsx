import { useMemo, useState } from "react";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { CAFETERIA_SCENES } from "@/scenes/cafeteria";
import { createCafeteria } from "@/interactions/cafeteria";
import { CAFETERIA_RETURN_KEY } from "@/data/storageKeys";

import { useInventory } from "@/contexts/InventoryContext";
import { useQuestActions } from "@/hooks/quest/useQuestActions";

import { useRandomEncounter } from "@/hooks/scene/useRandomEncounter";

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

  useRandomEncounter({
    storageKey: CAFETERIA_RETURN_KEY,
    blockedTiles: [
      { x: 4, y: 4 }, { x: 4, y: 3 }, { x: 12, y: 3 }, { x: 12, y: 4 },
      { x: 8, y: 10 }, { x: 8, y: 2 }, { x: 8, y: 3 },
    ],
    encounters: [
      { route: "/battle/rice", weight: 1 },
      { route: "/battle/piupiu", weight: 1 },
      { route: "/battle/goat", weight: 1 },
    ],
  });

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        className="Master Cafeteria"
        interactions={interactions}
        itemPickupTiles={[{ x: 11, y: 10, visible: !gotKey }]}
        popup={popup}
        setPopup={setPopup}
      />

      {popup && <Talking name="Sistema" message={popup} />}
    </>
  );
}
