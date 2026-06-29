import { useMemo, useState } from "react";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { CAFETERIA_SCENES } from "@/scenes/cafeteria";
import { createCafeteria } from "@/interactions/cafeteira";
import { CAFETERIA_RETURN_KEY } from "@/data/storageKeys";
import { slotKey } from "@/utils/save/slotManager";

import { useInventory } from "@/contexts/InventoryContext";
import { useQuestActions } from "@/hooks/quest/useQuestActions";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useRef, useEffect } from "react";

import Talking from "@/components/Talking";

type Props = {
  sceneId: SceneId;
};

export function CafeteriaScene({ sceneId }: Props) {
  const scene = CAFETERIA_SCENES[sceneId];

  const { player, setPosition } = usePlayer();
  const navigate = useNavigate();

  const { addItem, hasItem, removeItem } = useInventory();
  const { progressQuest } = useQuestActions();

  const [popup, setPopup] = useState<string | null>(null);
  const [gotKey, setGotKey] = useState(false);

  // ✅ interações específicas da cafeteria
  const interactions = useMemo(
    () =>
      createCafeteria({
        hasItem,
        addItem,
        removeItem,
        setPopup,
        gotKey,
        setGotKey,
        progressQuest,
      }),
    [addItem, gotKey, hasItem, removeItem, setPopup, setGotKey, progressQuest],
  );

  const lastPositionRef = useRef({ x: player.gridX, y: player.gridY });
  const setPositionRef = useRef(setPosition);
  setPositionRef.current = setPosition;

  useEffect(() => {
    const saved = localStorage.getItem(slotKey(CAFETERIA_RETURN_KEY));

    if (!saved) return;

    const { x, y, direction } = JSON.parse(saved);

    setPositionRef.current(x, y, direction);

    requestAnimationFrame(() => {
      setPositionRef.current(x, y, direction);
      localStorage.removeItem(slotKey(CAFETERIA_RETURN_KEY));
    });
  }, []);

  const playerRef = useRef(player);
  playerRef.current = player;

  useEffect(() => {
    const currentPlayer = playerRef.current;
    const { gridX, gridY } = currentPlayer;
    // 🚫 Tiles onde NÃO pode ter encontro

    const moved =
      gridX !== lastPositionRef.current.x ||
      gridY !== lastPositionRef.current.y;

    if (!moved) return;
    // Atualiza última posição
    lastPositionRef.current = { x: gridX, y: gridY };

    // Só funciona no modo explore (evita trigger em batalha)
    if (currentPlayer.mode !== "explore") return;

    const blockedTiles = [
      { x: 4, y: 4 },
      { x: 4, y: 3 },
      { x: 12, y: 3 },
      { x: 12, y: 4 },
      { x: 8, y: 10 },
      { x: 8, y: 2 },
      { x: 8, y: 3 },
    ];

    const isBlockedTile = blockedTiles.some(
      (tile) => tile.x === gridX && tile.y === gridY,
    );

    if (isBlockedTile) return;

    function saveLibraryPosition() {
      localStorage.setItem(
        slotKey(CAFETERIA_RETURN_KEY),
        JSON.stringify({
          x: currentPlayer.gridX,
          y: currentPlayer.gridY,
          direction: currentPlayer.direction,
        }),
      );
    }

    const encounterChance = Math.random();

    // 5% de chance
    if (encounterChance < 0.1) {
      saveLibraryPosition();

      const battleRoll = Math.random();

      if (battleRoll < 0.33) {
        navigate("/battle/rice");
      }
      else if (battleRoll < 0.66) {
        navigate("/battle/piupiu");
      } else {
        navigate("/battle/goat");
      }
    }
  }, [player.gridX, player.gridY, navigate]);

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        className="Master Cafeteria"
        interactions={interactions}
        itemPickupTiles={[{ x: 11, y: 10, visible: !gotKey }]}
        popup={popup}
        setPopup={setPopup}
      />

      {/* ✅ popup continua fora */}
      {popup && <Talking name="Sistema" message={popup} />}
    </>
  );
}
