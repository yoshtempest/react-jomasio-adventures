import styles from "./styles.module.css";
import { hallTwo } from "@/maps/hall/two";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { hallTwoDialogue } from "@/data/maps/hall/two";  
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
    <ExploreScene
      map={hallTwo}
      className={`Master ${styles.image}`}
      dialogueData={hallTwoDialogue}
      initialPosition={{ x: 9, y: 10, direction: "up" }} 
      npcs={[
        {
          src: "/assets/npcs/jailson/default.svg",
          gridX: 8,
          gridY: 3,
        },
      ]}
    />
  );
}