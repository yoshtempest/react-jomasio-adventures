import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { SceneBase } from "@/components/Game/Scenes/Base";
import { HALL_SCENES } from "@/scenes/hall";
import { PandemonyPuzzle } from "@/components/Game/Map/PandemonyPuzzle";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import Talking from "@/components/Game/Interactions/Talking";

type Props = {
  sceneId: SceneId;
};

export function HallScene({ sceneId }: Props) {
  const scene = HALL_SCENES[sceneId];
  const [popup, setPopup] = useState<string | null>(null);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const navigate = useNavigate();

  const { addItem, removeItem, hasItem } = useInventory();
  const { quests } = useQuests();

  const hasQuest = (id: string) => quests.some((q) => q.id === id);

  const handleExit = useCallback(
    ({ player }: { player: { gridX: number; gridY: number } }) => {
      if (sceneId === "hell" && player.gridX === 8 && player.gridY === 3) {
        const hasPandemony = quests.some((q) => q.id === "go_to_pandemony");
        if (hasPandemony) {
          setShowPuzzle(true);
        } else {
          setPopup("Porta trancada");
        }
        return true;
      }
      return false;
    },
    [quests, sceneId],
  );

  function handlePuzzleSolved() {
    setShowPuzzle(false);
    void navigate("/hall/pandemony");
  }

  function handlePuzzleClose() {
    setShowPuzzle(false);
  }

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        background={scene.background}
        popup={popup}
        setPopup={setPopup}
        handleExit={handleExit}
        onFinishExtra={() => ({
          addItem,
          removeItem,
          hasItem,
          hasQuest,
        })}
      />

      {popup && <Talking name="Sistema" message={popup} />}

      <PandemonyPuzzle
        isOpen={showPuzzle}
        onSolved={handlePuzzleSolved}
        onClose={handlePuzzleClose}
      />
    </>
  );
}
