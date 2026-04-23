import { hallOne } from "@/maps/hall/one";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";  


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
      initialPosition={{ x: 12, y: 7, direction: "left" }}
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