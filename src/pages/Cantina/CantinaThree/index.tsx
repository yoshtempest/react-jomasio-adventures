import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { cantinaThree } from "@/maps/cantina/cantinaThree";
import { cantinaDialogue } from "@/data/cantinaThree";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function CantinaThree() {

  const { player } = usePlayer();
  const navigate = useNavigate();
  useEffect(() => {
    if (player.gridX === 15 && player.gridY === 11) {
      navigate("/hall/one");
    }
  }, [player]);
  return (
    <div>
      <SceneWithDialogue
        map={cantinaThree}
        dialogueData={cantinaDialogue}
        initialPosition={{ x: 10, y: 4, direction: "down" }}
      />
    </div>
  );
}