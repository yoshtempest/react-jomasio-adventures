import { hallOne } from "@/maps/hall/one";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";  
import { AfterPcRoomTwoDialogue } from "@/data/maps/hall/one/afterPcRoom/two";  


export default function AfterPcRoomTwo() {
  const { player } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    if (player.gridX === 1 && player.gridY === 10) {
      navigate("/hall/left/one");
    }
  }, [player]);
  return (
    <ExploreScene
      map={hallOne}
      className={`Master HallOne`}
      dialogueData={AfterPcRoomTwoDialogue} 
      initialPosition={{ x: 2, y: 9, direction: "left" }}
      npcs={[
        {
          src: "/src/assets/npcs/remedinha/default.svg",
          gridX: 1,
          gridY: 9,
        },
      ]}
      transitions={[
        {
          positions: [
            { x: 8, y: 11 },
          ],
          to: "/cantina/four",
        },
        {
          positions: [{ x: 13, y: 7 }],
          to: "/pcroom/seven",
        },
        {
          positions: [
            { x: 7, y: 2 },
            { x: 8, y: 2 },
            { x: 9, y: 2 },
          ],
          to: "/hall/two",
        },
      ]}
    />
  );
}