import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameLayout } from "@/hooks/useGameLayout";
import { GameMap } from "@/components/Game/GameMap";
import { Player } from "@/components/Game/Player";
import { useGameAudio } from "@/hooks/useGameAudio";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";

type Position = {
  x: number;
  y: number;
};

type Transition = {
  positions: Position[];
  to: string;
};

type SceneProps = {
    map: any;
    initialPosition: {
        x: number;
        y: number;
        direction: "up" | "down" | "left" | "right";
    };
    transitions: Transition[];
    className?: string;
};

export function Scene({
    map,
    initialPosition,
    transitions,
    className,
}: SceneProps) {
  const { player, setMap, setPosition } = usePlayer();
  const navigate = useNavigate();

  const {
    TILE_SIZE,
    offsetX,
    offsetY,
    PLAYER_SIZE,
    MAP_COLS,
    MAP_ROWS,
  } = useGameLayout();

  // 🔁 Transições
  useEffect(() => {
    transitions.forEach(({ positions, to }) => {
      const match = positions.some(
        (pos) => pos.x === player.gridX && pos.y === player.gridY
      );

      if (match) {
        navigate(to);
      }
    });
  }, [player, transitions, navigate]);

  // 🗺️ Inicialização do mapa
  useEffect(() => {
    setMap(map);
    setPosition(
      initialPosition.x,
      initialPosition.y,
      initialPosition.direction
    );
  }, []);

  const backgroundAudio = useMemo(() => ({
    src: LavenderTown,
    loop: true,
    volume: 0.5,
  }), []);

  useGameAudio(backgroundAudio);

  return (
    <div className={className}>
      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        <Player
          direction={player.direction}
          gridX={player.gridX}
          gridY={player.gridY}
          TILE_SIZE={TILE_SIZE}
          PLAYER_SIZE={PLAYER_SIZE}
        />
      </GameMap>
    </div>
  );
}