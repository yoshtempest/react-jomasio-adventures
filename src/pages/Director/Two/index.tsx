import { useEffect, useMemo, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { director } from "@/maps/director";
import { useGameLayout } from "@/hooks/useGameLayout";
import { GameMap } from "@/components/Game/GameMap";
import { Player } from "@/components/Game/Player";
import Talking from "@/components/Talking";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useGameControls } from "@/contexts/GameControlsContext";
import { getTileInFront } from "@/utils/getTileInFront";
import { useInventory } from "@/contexts/InventoryContext";
import { useNavigate } from "react-router";
import { createDirector } from "@/interactions/director";

export default function DirectorTwo() {
  const { player, setMap } = usePlayer();
  const { setOnConfirm } = useGameControls();

  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem, removeItem } = useInventory();
  const navigate = useNavigate();
  const [gotKey, setGotKey] = useState(false);

  const backgroundAudio = useMemo(() => ({
    src: LavenderTown,
    loop: true,
    volume: 0.5,
  }), []);

  useGameAudio(backgroundAudio);

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } =
    useGameLayout();

  useEffect(() => {
    setMap(director);
  }, []);

  // 🧠 Interações por posição
  const interactionsByPosition = useMemo(() =>
    createDirector({
      hasItem,
      addItem,
      removeItem,
      navigate,
      setPopup: (msg) => setPopup(msg),
      gotKey,
      setGotKey,
    }),
  [
    hasItem,
    addItem,
    removeItem,
    navigate,
    gotKey,
  ]);

  useEffect(() => {

    setOnConfirm(() => () => {
      // 🔁 fechar popup
      if (popup) {
        setPopup(null);
        return;
      }

      const { x, y } = getTileInFront(player, director);

      const interaction = interactionsByPosition[`${x},${y}`];

      if (interaction) {
        interaction();
        return;
      }
    });

    return () => setOnConfirm(undefined);
  }, [player, popup]);

  return (
    <div className={`Master Director`}>
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

      {popup && (
        <Talking
          name="Sistema"
          message={popup}
        />
      )}
    </div>
  );
}