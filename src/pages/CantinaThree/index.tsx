import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { cantinaThree } from "@/maps/cantinaThree";
import { cantinaDialogue } from "@/data/cantinaThree";
import LavenderTown from "@/assets/LavenderTown.m4a";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function CantinaThree() {

  const { player } = usePlayer();
  const navigate = useNavigate();
  useEffect(() => {
    if (player.gridX === 15 && player.gridY === 11) {
      navigate("/hallOne");
    }
  }, [player]);
  return (
    <div>
      <SceneWithDialogue
        map={cantinaThree}
        dialogueData={cantinaDialogue}
        backgroundAudioSrc={LavenderTown}
        initialPosition={{ x: 10, y: 4, direction: "down" }}
      />
    </div>
  );
}