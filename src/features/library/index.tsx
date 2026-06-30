import { useMemo, useState } from "react";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { LIBRARY_SCENES } from "@/scenes/library";
import { createLibrary } from "@/interactions/library";

import { useInventory } from "@/contexts/InventoryContext";

import { LIBRARY_RETURN_KEY } from "@/data/storageKeys";

import { useRandomEncounter } from "@/hooks/scene/useRandomEncounter";

import Talking from "@/components/Talking";

type Props = {
  sceneId: SceneId;
};

export function LibraryScene({ sceneId }: Props) {
  const scene = LIBRARY_SCENES[sceneId];
  const { addItem } = useInventory();

  const [popup, setPopup] = useState<string | null>(null);
  const [gotKey, setGotKey] = useState(false);

  const interactions = useMemo(
    () =>
      createLibrary({
        addItem,
        setPopup,
        gotKey,
        setGotKey,
      }),
    [addItem, gotKey, setPopup, setGotKey],
  );

  useRandomEncounter({
    storageKey: LIBRARY_RETURN_KEY,
    blockedTiles: [
      { x: 4, y: 4 }, { x: 4, y: 3 }, { x: 12, y: 3 }, { x: 12, y: 4 },
      { x: 8, y: 10 }, { x: 8, y: 2 }, { x: 8, y: 3 },
    ],
    encounters: [
      { route: "/battle/hungry", weight: 19 },
      { route: "/battle/vandinhafragment", weight: 1 },
    ],
    encounterChance: 0.1,
  });

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        className={`Master Library ${scene.className ?? ""}`}
        interactions={interactions}
        itemPickupTiles={[{ x: 12, y: 9, visible: !gotKey }]}
        popup={popup}
        setPopup={setPopup}
      />

      {popup && <Talking name="Sistema" message={popup} />}
    </>
  );
}
