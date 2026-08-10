import { useState } from "react";

import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";

import { SceneBase } from "@/components/Game/Scenes/Base";
import Talking from "@/components/Talking";

import { JOMASIO_ENTRANCE_SCENES } from "@/scenes/jomasioEntrance";
import { sceneBackgrounds } from "@/data/scene/background";

type Props = {
  sceneId: SceneId;
};

export function JomasioEntranceScene({ sceneId }: Props) {
  const scene = JOMASIO_ENTRANCE_SCENES[sceneId];

  const { addItem, removeItem, hasItem } = useInventory();
  const { quests } = useQuests();

  const [popup, setPopup] = useState<string | null>(null);

  const hasQuest = (id: string) => quests.some((q) => q.id === id);

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        background={sceneBackgrounds.JomasioEntrance}
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
