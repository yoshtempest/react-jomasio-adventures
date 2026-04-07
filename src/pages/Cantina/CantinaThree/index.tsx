import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { cantinaThree } from "@/maps/cantina/cantinaThree";
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
        map={cantinaThree}
        dialogueData={cantinaDialogue}
        initialPosition={{ x: 10, y: 4, direction: "down" }}
        audio={{src: LavenderTown}}
        npcs={[
          {
            src: "/src/assets/npcs/jhowsimar/default.svg",
            gridX: 9,
            gridY: 4,
          },
        ]}
      />
    </div>
  );
}