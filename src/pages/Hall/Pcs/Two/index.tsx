import styles from "./styles.module.css";
import { hallTwo } from "@/maps/hall/two";
import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { HallTwoDialogue } from "@/data/maps/hall/two/one";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";

export default function HallTwo() {
  const { player } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    if (player.gridX === 9 && player.gridY === 11) {
      navigate(-1);
    }
  }, [player]);
  return (
    <div className={`Master ${styles.image}`}>
      <SceneWithDialogue
        map={hallTwo}
        dialogueData={HallTwoDialogue}
        initialPosition={{ x: 9, y: 10, direction: "up" }}
        audio={{src: LavenderTown}}
        npcs={[
          {
            src: "/src/assets/npcs/jailson/default.svg",
            gridX: 8,
            gridY: 3,
          },
        ]}
      />
    </div>
  );
}