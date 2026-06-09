import { SceneBase } from "@/components/Game/Scenes/Base";
import { FOOTBALLCOURT_SCENES } from "@/scenes/footballCourt";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import type { SceneId } from "@/utils/types/maps/sceneConfig";


type Props = {
  sceneId: SceneId;
};

export function FootballCourtScene({ sceneId }: Props) {
  const scene = FOOTBALLCOURT_SCENES[sceneId];

  const { addItem, removeItem, hasItem } = useInventory();
  const { quests } = useQuests();

  const hasQuest = (id: string) =>
    quests.some((q) => q.id === id);

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <SceneBase
      scene={scene}
      className={`Master FootballCourt`}
      onFinishExtra={() => ({
        addItem,
        removeItem,
        hasItem,
        hasQuest,
      })}
    />
  );
}