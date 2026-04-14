import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { cantinaFour } from "@/maps/cantina/cantinaFour";
import { cantinaDialogue } from "@/data/maps/cantina/cantinaThree";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";

export default function CantinaThree() {

  const { player } = usePlayer();
  const navigate = useNavigate();
  useEffect(() => {
    if (player.gridX === 15 && player.gridY === 11) {
      navigate("/hall/one");
    }
  }, [player]);
  return (
    <div className={`Master Cantina`}>
      <SceneWithDialogue
        map={cantinaFour}
        dialogueData={cantinaDialogue}
        initialPosition={{ x: 10, y: 4, direction: "left" }}
        audio={{src: LavenderTown}}
      />
    </div>
  );
}