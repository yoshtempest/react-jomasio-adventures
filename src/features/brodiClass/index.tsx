import { useMemo, useState } from "react";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { BRODICLASS_SCENES } from "@/scenes/brodiclass";

import { useInventory } from "@/contexts/InventoryContext";
import { useFlags } from "@/contexts/FlagContext";

import { sceneBackgrounds } from "@/data/scene/background";

import Talking from "@/components/Game/Interactions/Talking";
import { createBrodiClass } from "@/interactions/brodiClass";

type Props = {
  sceneId: SceneId;
};

export function BrodiClassScene({ sceneId }: Props) {
  const scene = BRODICLASS_SCENES[sceneId];
  const { addItem } = useInventory();
  const { hasFlag, setFlag } = useFlags();

  const [popup, setPopup] = useState<string | null>(null);
  const gotGoatMeat = hasFlag("picked_goat_meat");
  const gotChest = hasFlag("picked_legendary_chest");

  // ✅ interações específicas da brodiClass
  const interactions = useMemo(
    () =>
      createBrodiClass({
        addItem,
        setPopup,
        goatMeatDeps: { gotKey: gotGoatMeat, setFlag },
        chestDeps: { gotKey: gotChest, setFlag },
      }),
    [addItem, gotGoatMeat, gotChest, setFlag],
  );

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        background={sceneBackgrounds.BrodiClass}
        interactions={interactions}
        itemPickupTiles={[
          {
            x: 10,
            y: 8,
            visible: !gotGoatMeat,
            image: "/assets/items/goat_meat.svg",
          },
          {
            x: 20,
            y: 11,
            visible: !gotChest,
            image: "/assets/items/chests/legendary.svg",
          },
        ]}
        popup={popup}
        setPopup={setPopup}
      />

      {/* ✅ popup continua fora do SceneBase */}
      {popup && <Talking name="Sistema" message={popup} />}
    </>
  );
}
