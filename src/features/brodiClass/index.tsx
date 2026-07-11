import { useMemo, useState } from "react";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { BRODICLASS_SCENES } from "@/scenes/brodiclass";

import { useInventory } from "@/contexts/InventoryContext";

import { sceneBackgrounds } from "@/data/sceneBackground";

import Talking from "@/components/Talking";
import { createBrodiClass } from "@/interactions/brodiClass";

type Props = {
  sceneId: SceneId;
};

export function BrodiClassScene({ sceneId }: Props) {
  const scene = BRODICLASS_SCENES[sceneId];
  const { addItem } = useInventory();

  const [popup, setPopup] = useState<string | null>(null);
  const [gotKey, setGotKey] = useState(false);

  // ✅ interações específicas da brodiClass
  const interactions = useMemo(
    () =>
      createBrodiClass({
        addItem,
        setPopup,
        gotKey,
        setGotKey,
      }),
    [addItem, gotKey],
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
        itemPickupTiles={[{ x: 13, y: 4, visible: !gotKey }]}
        popup={popup}
        setPopup={setPopup}
      />

      {/* ✅ popup continua fora do SceneBase */}
      {popup && <Talking name="Sistema" message={popup} />}
    </>
  );
}
