import { SceneBase } from "@/components/Game/Scenes/Base";
import { FOOTBALLCOURT_SCENES } from "@/scenes/footballCourt";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { sceneBackgrounds } from "@/data/scene/background";

type Props = {
  sceneId: SceneId;
};

export function FootballCourtScene({ sceneId }: Props) {
  const scene = FOOTBALLCOURT_SCENES[sceneId];

  const { addItem, removeItem, hasItem } = useInventory();
  const { quests } = useQuests();

  const hasQuest = (id: string) => quests.some((q) => q.id === id);

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <SceneBase
      scene={scene}
      background={sceneBackgrounds.FootballCourt}
      onFinishExtra={() => ({
        addItem,
        removeItem,
        hasItem,
        hasQuest,
      })}
    />
  );
}
