import { useState } from "react";
import { SceneBase } from "@/components/Game/Scenes/Base";
import { ChoiceBox } from "@/components/ChoiceBox";
import { HELLROOM_SCENES } from "@/scenes/hellroom";
import { useFlags } from "@/contexts/FlagContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { sceneBackgrounds } from "@/data/scene/background";

type Props = {
  sceneId: SceneId;
};

export function HellScene({ sceneId }: Props) {
  const scene = HELLROOM_SCENES[sceneId];

  const { setFlag, hasFlag } = useFlags();
  const { addDrop, isOwned } = useEquipment();
  const { player } = usePlayer();

  const [showChoice, setShowChoice] = useState(false);

  const hasTurkeyPet = isOwned(player.character, "pet_turkey");

  function handleChoice() {
    setShowChoice(false);
    setFlag("chose_peru");
    addDrop(player.character, "pet_turkey");
  }

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        background={sceneBackgrounds.HellRoom}
        onFinishExtra={() => {
          if (sceneId !== "one") return;
          if (hasFlag("chose_peru")) {
            if (!hasTurkeyPet) addDrop(player.character, "pet_turkey");
            return;
          }
          if (!hasTurkeyPet) {
            setShowChoice(true);
          } else {
            setFlag("chose_peru");
          }
        }}
      />
      {showChoice && (
        <ChoiceBox
          prompt="Você gosta de cavalgar no Peru?"
          options={["Talvez", "La Ele"]}
          onSelect={handleChoice}
        />
      )}
    </>
  );
}
