import { useEffect, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { blocked } from "@/maps/blocked";
import Talking from "@/components/Talking";
import { useCutscene } from "@/hooks/useCutscene";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";
import { useSansTalking } from "@/hooks/useSansTalking";
import { useGameControls } from "@/contexts/GameControlsContext";
import { directorDialogue } from "@/data/maps/director/one";
import { useNavigate } from "react-router";
import { SceneWithDialogue } from "@/components/SceneWithDialogue";

export default function Director() {
  const { player } = usePlayer();
  const { play: playSansTalking } = useSansTalking(false);
  const { setOnConfirm } = useGameControls();
  const navigate = useNavigate();

  const [popup, setPopup] = useState<string | null>(null);

  const cutscene = useCutscene({
    dialogue: directorDialogue,
    playAudio: playSansTalking,
  });

  const [cutsceneStarted, setCutsceneStarted] = useState(false);

  useEffect(() => {
    if (cutscene.isOpen) {
      setCutsceneStarted(true);
    }
  }, [cutscene.isOpen]);

  useEffect(() => {
    if (!cutscene.isOpen && cutsceneStarted) {
      navigate("/director/two");
    }
  }, [cutscene.isOpen, cutsceneStarted]);

  useEffect(() => {
    // cutscene já controla input → não interferir
    if (cutscene.isOpen) return;

    setOnConfirm(() => () => {
      // 🔁 fechar popup
      if (popup) {
        setPopup(null);
        return;
      }
    });

    return () => setOnConfirm(undefined);
  }, [player, popup, cutscene.isOpen]);

  return (
    <div className={`Master Director`}>
      <SceneWithDialogue
        map={blocked}
        dialogueData={directorDialogue}
        initialPosition={{ x: 9, y: 5, direction: "up" }}
        audio={{src: LavenderTown}}
        nextRoute="/director/two"
        npcs={[
          {
            src: "/src/assets/npcs/system/default.svg",
            gridX: 9,
            gridY: 4,
          },
        ]}
      />

      {cutscene.isOpen && (
        <Talking
          src={cutscene.dialogue.src}
          name={cutscene.dialogue.name}
          message={cutscene.dialogue.message}
        />
      )}
    </div>
  );
}