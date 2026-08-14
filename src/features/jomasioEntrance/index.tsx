import { useMemo, useState } from "react";

import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { useFlags } from "@/contexts/FlagContext";
import { useHasToolEquipped } from "@/hooks/interaction/useHasToolEquipped";
import { createToolInteraction } from "@/interactions/builder";
import type { ToolDeps } from "@/utils/types/interaction";
import type { InventoryItem } from "@/utils/types/player/inventory";

import { SceneBase } from "@/components/Game/Scenes/Base";
import Talking from "@/components/Talking";

import { JOMASIO_ENTRANCE_SCENES } from "@/scenes/jomasioEntrance";
import { sceneBackgrounds } from "@/data/scene/background";

type Props = {
  sceneId: SceneId;
};

type MineRockDeps = ToolDeps & {
  addItem: (item: InventoryItem) => void;
  setFlag: (flag: FlagId) => void;
};

export function JomasioEntranceScene({ sceneId }: Props) {
  const scene = JOMASIO_ENTRANCE_SCENES[sceneId];

  const { addItem, removeItem, hasItem } = useInventory();
  const { quests } = useQuests();
  const { hasFlag, setFlag } = useFlags();
  const hasToolEquipped = useHasToolEquipped();

  const [popup, setPopup] = useState<string | null>(null);

  const hasQuest = (id: string) => quests.some((q) => q.id === id);

  const interactions = useMemo(() => {
    const mineRock = createToolInteraction<MineRockDeps>(
      "weapon_picareta",
      "Você precisa equipar uma picareta para minerar.",
      (deps) => {
        deps.addItem({ id: "hungry_essence" as ItemId, qty: 5 });
        deps.setPopup("Você minerou a rocha e encontrou essências!");
        deps.setFlag("mined_entrance_rock");
      },
    );

    return {
      "13,10": () =>
        mineRock({ setPopup, addItem, hasToolEquipped, setFlag }),
    };
  }, [setPopup, addItem, hasToolEquipped, setFlag]);

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        background={sceneBackgrounds.JomasioEntrance}
        interactions={interactions}
        interactionLabels={{ "13,10": "[L] Minerar" }}
        itemPickupTiles={[
          {
            x: 13,
            y: 10,
            visible: !hasFlag("mined_entrance_rock"),
            image: "/assets/map/rocha.svg",
          },
        ]}
        popup={popup}
        setPopup={setPopup}
        onFinishExtra={() => ({
          addItem,
          removeItem,
          hasItem,
          hasQuest,
        })}
      />

      {popup && <Talking name="Sistema" message={popup} />}
    </>
  );
}
