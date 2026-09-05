import { useEffect } from "react";
import Talking from "@/components/Game/Interactions/Talking";
import { ChoiceBox } from "@/components/Game/Interactions/ChoiceBox";
import SOS from "/assets/songs/background/battle/SOSFromEarth.m4a";
import { useBackgroundAudio } from "@/hooks/useBackgroundAudio";
import { useNavigate } from "react-router";
import { useCutscene } from "@/hooks/interaction/useCutscene";
import { useSansTalking } from "@/hooks/interaction/useSansTalking";
import { firstCutsceneDialogue } from "@/data/dialogues/firstCutscene";

import { sceneBackgrounds } from "@/data/scene/background";
import { useNavbar } from "@/contexts/NavbarContext";

export default function FirstCutscene() {
  const navigate = useNavigate();
  const { play: playSansTalking } = useSansTalking(false);
  const { closeNavbar } = useNavbar();

  useBackgroundAudio(SOS);

  useEffect(() => {
    closeNavbar();
  }, [closeNavbar]);

  const cutscene = useCutscene({
    dialogue: firstCutsceneDialogue,
    playAudio: playSansTalking,
    onFinish: () => {
      void navigate("/tutorial");
    },
  });

  const dialogue = cutscene.dialogue;

  return (
    <div
      className="Master"
      style={{ backgroundImage: `url(${sceneBackgrounds.FirstCutscene})` }}
    >
      {dialogue && <Talking name={dialogue.name} message={dialogue.message} />}

      {cutscene.isSkipPromptOpen && (
        <ChoiceBox
          prompt="Tem certeza que deseja pular a cutscene?"
          options={["Sim", "Não"]}
          onSelect={(index) =>
            index === 0 ? cutscene.confirmSkip() : cutscene.cancelSkip()
          }
        />
      )}
    </div>
  );
}
