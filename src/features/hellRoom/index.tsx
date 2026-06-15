import { useState } from "react";
import { SceneBase } from "@/components/Game/Scenes/Base";
import { ChoiceBox } from "@/components/ChoiceBox";
import { HELLROOM_SCENES } from "@/scenes/hellroom";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { useFlags } from "@/contexts/FlagContext";
import { ITEMS } from "@/data/items";

type Props = {
  sceneId: SceneId;
};

export function HellScene({ sceneId }: Props) {
  const scene = HELLROOM_SCENES[sceneId];

  const { addItem, removeItem, hasItem } = useInventory();
  const { quests } = useQuests();
  const { setFlag, hasFlag } = useFlags();

  const [showChoice, setShowChoice] = useState(false);

  const hasQuest = (id: string) => quests.some((q) => q.id === id);

  function handleChoice(chose: boolean) {
    setShowChoice(false);
    if (chose) {
      setFlag("chose_peru");
    }
    addItem(ITEMS.turkey);
  }

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        className={`Master HellRoom`}
        onFinishExtra={() => {
          if (
            sceneId === "one" &&
            !hasFlag("chose_peru") &&
            !hasItem("turkey")
          ) {
            setShowChoice(true);
          }
          return {
            addItem,
            removeItem,
            hasItem,
            hasQuest,
          };
        }}
      />
      {showChoice && (
        <ChoiceBox
          prompt="Você gosta de cavalgar no Peru?"
          options={["Talvez", "La Ele"]}
          onSelect={(i) => handleChoice(i === 0)}
        />
      )}
    </>
  );
}
