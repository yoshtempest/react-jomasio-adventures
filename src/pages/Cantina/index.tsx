import { useEffect, useState } from "react";
import { useGameControls } from "../../contexts/GameControlsContext";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./styles.module.css";
import { cantina } from "../../maps/cantina";
import { useGameLayout } from "../../hooks/useGameLayout";
import { GameMap } from "../../components/Game/GameMap";
import { Player } from "../../components/Game/Player";
import { NPC } from "../../components/Game/Npc";
import Talking from "../../components/Talking";

export default function Cantina() {
  const { player, setMap } = usePlayer();
  const { setOnConfirm } = useGameControls();

  const [showDialog, setShowDialog] = useState(false);
  const [index, setIndex] = useState(0);

  const dialogues = [
    {
      name: "Jhow Simar",
      message: "Tu... tu tá com um objeto amaldiçoado!",
    },
    {
      name: "Jhow Simar",
      message: "Pega a lapada pega",
    },
  ];

  function getTileInFront() {
    let x = player.gridX;
    let y = player.gridY;

    switch (player.direction) {
      case "up":
        y -= 1;
        break;
      case "down":
        y += 1;
        break;
      case "left":
        x -= 1;
        break;
      case "right":
        x += 1;
        break;
    }

    return { x, y };
  }

  function nextDialogue() {
    setIndex((prev) => {
      if (prev >= dialogues.length - 1) {
        setShowDialog(false);
        return 0;
      }
      return prev + 1;
    });
  }

  useEffect(() => {
    setOnConfirm(() => () => {
      // 👉 se já está conversando → avança diálogo
      if (showDialog) {
        nextDialogue();
        return;
      }

      // 👉 verifica NPC
      const { x, y } = getTileInFront();

      if (cantina[y]?.[x] === 2) {
        setShowDialog(true);
      }
    });

    return () => setOnConfirm(undefined);
  }, [player, showDialog]);

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } =
    useGameLayout();

  useEffect(() => {
    setMap(cantina);
  }, [setMap]);

  return (
    <div className={`Master ${styles.image}`}>
      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        <NPC src="/src/assets/jhowsimar/default.svg"gridX={9} gridY={4} TILE_SIZE={TILE_SIZE} />
        <Player
          direction={player.direction}
          gridX={player.gridX}
          gridY={player.gridY}
          TILE_SIZE={TILE_SIZE}
          PLAYER_SIZE={PLAYER_SIZE}
        />
      </GameMap>

      {/* 💬 DIÁLOGO */}
      {showDialog && (
        <Talking
          name={dialogues[index].name}
          message={dialogues[index].message}
        />
      )}
    </div>
  );
}