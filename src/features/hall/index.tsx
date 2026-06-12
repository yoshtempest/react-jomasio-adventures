import { useState } from "react";
import { SceneBase } from "@/components/Game/Scenes/Base";
import { HALL_SCENES } from "@/scenes/hall";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import type { SceneId } from "@/utils/types/maps/sceneConfig";
import Talking from "@/components/Talking";


type Props = {
  sceneId: SceneId;
};

export function HallScene({ sceneId }: Props) {
  const scene = HALL_SCENES[sceneId];
  const [popup, setPopup] = useState<string | null>(null);

  const { addItem, removeItem, hasItem } = useInventory();
  const { quests } = useQuests();

  const hasQuest = (id: string) =>
    quests.some((q) => q.id === id);

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        className={`Master ${scene.className ?? ""}`}
        popup={popup}
        setPopup={setPopup}
        onFinishExtra={() => ({
          addItem,
          removeItem,
          hasItem,
          hasQuest,
        })}
      />

      {popup && (
        <Talking
          name="Sistema"
          message={popup}
        />
      )}
    </>
  );
}