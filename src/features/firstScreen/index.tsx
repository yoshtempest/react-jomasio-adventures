import { useState } from "react";

import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";

import { SceneBase } from "@/components/Game/Scenes/Base";
import Talking from "@/components/Talking";

import { FIRSTSCREEN_SCENES } from "@/scenes/firstscreen";
import { sceneBackgrounds } from "@/data/scene/background";

type Props = {
  sceneId: SceneId;
};

export function FirstScreenScene({ sceneId }: Props) {
  const scene = FIRSTSCREEN_SCENES[sceneId];

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
        background={sceneBackgrounds.FirstScreen}
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
