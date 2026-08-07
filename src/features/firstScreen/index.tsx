import { SceneBase } from "@/components/Game/Scenes/Base";
import { FIRSTSCREEN_SCENES } from "@/scenes/firstscreen";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { sceneBackgrounds } from "@/data/scene/background";

type Props = {
  sceneId: SceneId;
};

export function FirstScreenScene({ sceneId }: Props) {
  const scene = FIRSTSCREEN_SCENES[sceneId];

  const { addItem, removeItem, hasItem } = useInventory();
  const { quests } = useQuests();

  const hasQuest = (id: string) => quests.some((q) => q.id === id);

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <SceneBase
      scene={scene}
      background={sceneBackgrounds.FirstScreen}
      onFinishExtra={() => ({
        addItem,
        removeItem,
        hasItem,
        hasQuest,
      })}
    />
  );
}
