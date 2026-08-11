import { useMemo, useState } from "react";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { LIBRARY_SCENES } from "@/scenes/library";
import { createLibrary } from "@/interactions/library";

import { useInventory } from "@/contexts/InventoryContext";
import { useFlags } from "@/contexts/FlagContext";

import { LIBRARY_RETURN_KEY } from "@/data/storageKeys";

import { useRandomEncounter } from "@/hooks/scene/useRandomEncounter";

import Talking from "@/components/Talking";

type Props = {
  sceneId: SceneId;
};

export function LibraryScene({ sceneId }: Props) {
  const scene = LIBRARY_SCENES[sceneId];
  const { addItem } = useInventory();
  const { hasFlag, setFlag } = useFlags();

  const [popup, setPopup] = useState<string | null>(null);
  const gotPackage = hasFlag("picked_package_01");
  const gotChest = hasFlag("picked_rare_chest");

  const interactions = useMemo(
    () =>
      createLibrary({
        addItem,
        setPopup,
        packageDeps: { gotKey: gotPackage, setFlag },
        chestDeps: { gotKey: gotChest, setFlag },
      }),
    [addItem, gotPackage, gotChest, setPopup, setFlag],
  );

  useRandomEncounter({
    storageKey: LIBRARY_RETURN_KEY,
    blockedTiles: [
      { x: 4, y: 3 },
      { x: 4, y: 2 },
      { x: 14, y: 2 },
      { x: 14, y: 3 },
      { x: 8, y: 10 },
      { x: 8, y: 2 },
      { x: 8, y: 3 },
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
        background={scene.background}
        interactions={interactions}
        itemPickupTiles={[
          { x: 15, y: 9, visible: !gotPackage, image: "/assets/items/package_01.svg" },
          { x: 3, y: 5, visible: !gotChest, image: "/assets/items/chests/rare.svg" },
        ]}
        popup={popup}
        setPopup={setPopup}
      />

      {popup && <Talking name="Sistema" message={popup} />}
    </>
  );
}
