import { Scene } from "@/components/Scene";
import { library } from "@/maps/library";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

export default function Library() {
  const { player } = usePlayer();
  const navigate = useNavigate();

  const lastPositionRef = useRef({ x: player.gridX, y: player.gridY });

  useEffect(() => {
    const { gridX, gridY } = player;

    const moved =
      gridX !== lastPositionRef.current.x ||
      gridY !== lastPositionRef.current.y;

    if (!moved) return;

    // Atualiza última posição
    lastPositionRef.current = { x: gridX, y: gridY };

    // Só funciona no modo explore (evita trigger em batalha)
    if (player.mode !== "explore") return;

    // 🎲 10% de chance
    const chance = Math.random();

    if (chance < 0.02) {
      navigate("/library/battle");
    }
  }, [player.gridX, player.gridY]);

  return (
    <div className={`Master Library`}>
      <Scene
        map={library}
        className={`Master Library`}
        initialPosition={{ x: 4, y: 4, direction: "down" }}
        transitions={[
          {
            positions: [{ x: 4, y: 3 }],
            to: "/hall/thirdclass",
          },
        ]}
      />
    </div>
  );
}