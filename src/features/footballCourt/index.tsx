import { SceneBase } from "@/components/Game/Scenes/Base";
import { FOOTBALLCOURT_SCENES } from "@/scenes/footballCourt";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { sceneBackgrounds } from "@/data/scene/background";
import { useFootballCourtDogs } from "@/hooks/scene/footballCourtDogs/useFootballCourtDogs";
import { useMemo } from "react";

type Props = {
  sceneId: SceneId;
};

export function FootballCourtScene({ sceneId }: Props) {
  const scene = FOOTBALLCOURT_SCENES[sceneId];

  const { addItem, removeItem, hasItem } = useInventory();
  const { quests } = useQuests();

  const hasQuest = (id: string) => quests.some((q) => q.id === id);

  const { dogNpcs } = useFootballCourtDogs();

  const sceneWithDogs = useMemo(
    () =>
      scene?.id === "one"
        ? { ...scene, npcs: [...(scene.npcs ?? []), ...dogNpcs] }
        : scene,
    [scene, dogNpcs],
  );

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <SceneBase
      scene={sceneWithDogs ?? scene}
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
