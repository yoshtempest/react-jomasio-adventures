import { useEffect, useMemo, useState } from "react";
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
import { getTileInFront } from "@/utils/getTileInFront";
import { Inventory } from "@/components/Navbar/Inventory";

export default function PcRoomOne() {
    const { player, setMap, setPosition } = usePlayer();
    const { play: playSansTalking } = useSansTalking(false);
    const { setOnConfirm } = useGameControls();

    const [popup, setPopup] = useState<string | null>(null);
    const { addItem, hasItem, removeItem, isOpen } = useInventory();
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

    useEffect(() => {
      if (player.gridX === 3 && player.gridY === 3) {
        navigate("/hall/one");
      }
    }, [player]);

  const interactionsByPosition = useMemo(() =>
      createPcsRoom({
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
      // cutscene já controla input → não interferir
      if (dialogueSystem.isOpen) return;
  
      setOnConfirm(() => () => {
        // 🔁 fechar popup
        if (popup) {
          setPopup(null);
          return;
        }
  
        const { x, y } = getTileInFront(player, pcsRoom);
  
        const interaction = interactionsByPosition[`${x},${y}`];
  
        if (interaction) {
          interaction();
          return;
        }
      });
  
      return () => setOnConfirm(undefined);
    }, [player, popup, dialogueSystem.isOpen]);

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