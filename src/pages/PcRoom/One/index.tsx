import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import styles from "./styles.module.css";
import { pcsRoom } from "@/maps/pcsRoom";
import { useGameLayout } from "@/hooks/useGameLayout";
import { GameMap } from "@/components/Game/GameMap";
import { Player } from "@/components/Game/Player";
import { useInventory } from "@/contexts/InventoryContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { createPcsRoom } from "@/interactions/pcsRoom";
import { useGameAudio } from "@/hooks/useGameAudio";
import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";
import { NPC } from "@/components/Game/Npc";
import Talking from "@/components/Talking";
import { useDialogue } from "@/hooks/interaction/useDialogue";
import { pcsRoomDialogue } from "@/data/pcsRoom";
import { useSansTalking } from "@/hooks/useSansTalking";
import { Inventory } from "@/components/Navbar/Inventory";
import { useInteraction } from "@/hooks/interaction/useInteraction";

export default function PcRoomOne() {
  const { player, setMap, setPosition } = usePlayer();
  const { play: playSansTalking } = useSansTalking(false);
  const { setOnConfirm } = useGameControls();

  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem, isOpen } = useInventory();
  const navigate = useNavigate();
  const [gotKey, setGotKey] = useState(false);

  const backgroundAudio = useMemo(() => ({
    src: MonkeyCircle,
    loop: true,
    volume: 0.5,
  }), []);

  const dialogueSystem = useDialogue(
    pcsRoomDialogue,
    playSansTalking
  );

  useGameAudio(backgroundAudio);

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } = useGameLayout();

  // 🚪 Transição de mapa
  useEffect(() => {
    if (player.gridX === 3 && player.gridY === 3) {
      navigate("/hall/one");
    }
  }, [player]);

  // 🧠 Interações do mapa
  const interactionsByPosition = useMemo(() =>
    createPcsRoom({
      hasItem,
      addItem,
      setPopup: (msg) => setPopup(msg),
      gotKey,
      setGotKey,
    }),
    [hasItem, addItem, gotKey]
  );

  // 🎮 Handler único de interação
  const handleInteract = useCallback(
    (tile: number, x: number, y: number) => {

      // 1️⃣ diálogo aberto → avança
      if (dialogueSystem.isOpen) {
        dialogueSystem.next();
        playSansTalking();
        return;
      }

      // 2️⃣ fechar popup
      if (popup) {
        setPopup(null);
        return;
      }

      // 3️⃣ interação por posição
      const interaction = interactionsByPosition[`${x},${y}`];
      if (interaction) {
        interaction();
        return;
      }

      // 4️⃣ interação por tile (ex: NPC)
      if (tile === 2) {
        dialogueSystem.start();
        playSansTalking();
      }
    },
    [
      dialogueSystem,
      popup,
      interactionsByPosition,
      playSansTalking,
    ]
  );

  // 🎯 Hook central de interação
  useInteraction({
    player,
    map: pcsRoom,
    setOnConfirm,
    onInteract: handleInteract,
  });

  // 🗺️ Setup inicial
  useEffect(() => {
    setMap(pcsRoom);
    setPosition(3, 4, "down");
  }, []);

  return (
    <div className={`Master ${styles.image}`}>
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

        <NPC
          src="/src/assets/npcs/janderson/default.svg"
          gridX={8}
          gridY={8}
          TILE_SIZE={TILE_SIZE}
        />
      </GameMap>

      {dialogueSystem.isOpen && (
        <Talking
          src={dialogueSystem.dialogue.src}
          name={dialogueSystem.dialogue.name}
          message={dialogueSystem.dialogue.message}
        />
      )}

      {popup && (
        <Talking
          name="Sistema"
          message={popup}
        />
      )}

      {isOpen && <Inventory />}
    </div>
  );
}