import { SceneBase } from "@/components/Game/Scenes/Base";
import { HALL_SCENES } from "@/scenes/Hall";

import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";

import type { SceneId } from "@/utils/types/maps/sceneConfig";

type Props = {
  sceneId: SceneId;
};

export function HallScene({ sceneId }: Props) {
  const scene = HALL_SCENES[sceneId];

  const { addItem, removeItem, hasItem } = useInventory();
  const { quests } = useQuests();

  // ✅ helper específico do hall
  const hasQuest = (id: string) =>
    quests.some((q) => q.id === id);

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <SceneBase
      scene={scene}
      className={`Master ${scene.className}`}

      // 🔥 aqui vai o diferencial do Hall
      onFinishExtra={() => ({
        addItem,
        removeItem,
        hasItem,
        hasQuest,
      })}
    />
  );
}