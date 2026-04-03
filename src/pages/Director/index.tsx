import { useEffect, useMemo, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import styles from "./styles.module.css";
import { director } from "@/maps/director";
import { useGameLayout } from "@/hooks/useGameLayout";
import { GameMap } from "@/components/Game/GameMap";
import { Player } from "@/components/Game/Player";
import { NPC } from "@/components/Game/Npc";
import Talking from "@/components/Talking";
import { useCutscene } from "@/hooks/useCutscene";
import LavenderTown from "@/assets/LavenderTown.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useSansTalking } from "@/hooks/useSansTalking";
import { useGameControls } from "@/contexts/GameControlsContext";
import { getTileInFront } from "@/utils/getTileInFront";
import { Inventory } from "@/components/Navbar/Inventory";
import { useInventory } from "@/contexts/InventoryContext";
import { useNavigate } from "react-router";

export default function Director() {
  const { player, setMap } = usePlayer();
  const { play: playSansTalking } = useSansTalking(false);
  const { setOnConfirm } = useGameControls();

  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem, removeItem, isOpen } = useInventory();
  const navigate = useNavigate();
  const [gotKey, setGotKey] = useState(false);

  const cutscene = useCutscene({
    dialogue: [
      {
        src: "/src/assets/default.svg",
        name: "Protagonista",
        message: "Que lugar é esse? Parece uma cela de prisão...",
      },
      {
        src: "/src/assets/npcs/system/right.svg",
        name: "Janela de Sistema",
        message: "Janela de sistema desbloqueada!",
      },
      {
        src: "/src/assets/default.svg",
        name: "Protagonista",
        message: "Mas que poha é essa?",
      },
      {
        src: "/src/assets/npcs/system/right.svg",
        name: "Janela de Sistema",
        message: "Se vira ai. Não sou pago pra isso",
      },
      {
        src: "/src/assets/default.svg",
        name: "Protagonista",
        message: "Então vai se fu- não vou me estressar com isso.",
      },
    ],
    playAudio: playSansTalking,
  });

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
  const interactionsByPosition: Record<string, () => void> = {
    "4,3": () => {
    if (hasItem("key_01")) {
      setPopup("Você usou a chave.");

      setTimeout(() => {
        removeItem("key_01");
        navigate("/cantina");
      }, 1000);
      } else {
        setPopup("Essa porta está trancada.");
      }
    },

    "6,4": () => setPopup("Nada por aqui."),

    "7,4": () => {
      if (!gotKey) {
        setPopup("Uma chave suspeita, deve ser da porta...");

        addItem({
          id: "key_01",
          name: "Chave enferrujada",
        });

        setGotKey(true);
      } else {
        setPopup("Nada mais aqui.");
      }
    },
  };

  useEffect(() => {
    // cutscene já controla input → não interferir
    if (cutscene.isOpen) return;

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
  }, [player, popup, cutscene.isOpen]);

  return (
    <div className={`Master ${styles.image}`}>
      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        <NPC
          src="/src/assets/npcs/system/default.svg"
          gridX={9}
          gridY={4}
          TILE_SIZE={TILE_SIZE}
        />
        <Player
          direction={player.direction}
          gridX={player.gridX}
          gridY={player.gridY}
          TILE_SIZE={TILE_SIZE}
          PLAYER_SIZE={PLAYER_SIZE}
        />
      </GameMap>

      {cutscene.isOpen && (
        <Talking
          src={cutscene.dialogue.src}
          name={cutscene.dialogue.name}
          message={cutscene.dialogue.message}
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