import { useMemo, useState, useEffect, useRef } from "react";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { LIBRARY_SCENES } from "@/scenes/library";
import { createLibrary } from "@/interactions/library";

import { useInventory } from "@/contexts/InventoryContext";
import type { SceneId } from "@/utils/types/maps/sceneConfig";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";

import Talking from "@/components/Talking";

type Props = {
  sceneId: SceneId;
};

export function LibraryScene({ sceneId }: Props) {
  const scene = LIBRARY_SCENES[sceneId];
  const { addItem } = useInventory();
  const { player, setPosition } = usePlayer();
  const navigate = useNavigate();

  const [popup, setPopup] = useState<string | null>(null);
  const [gotKey, setGotKey] = useState(false);

  // ✅ interações específicas da cantina
  const interactions = useMemo(
    () =>
      createLibrary({
        addItem,
        setPopup,
        gotKey,
        setGotKey,
      }),
    [addItem, gotKey]
  );

  const lastPositionRef = useRef({ x: player.gridX, y: player.gridY });
  useEffect(() => {
    const saved = localStorage.getItem("library_return_position");

    if (!saved) return;

    const { x, y, direction } = JSON.parse(saved);

    setPosition(x, y, direction);

    requestAnimationFrame(() => {
      setPosition(x, y, direction);
      localStorage.removeItem("library_return_position");
    });
  }, []);

  useEffect(() => {
    const { gridX, gridY } = player;
    // 🚫 Tiles onde NÃO pode ter encontro

    const moved =
      gridX !== lastPositionRef.current.x ||
      gridY !== lastPositionRef.current.y;

    if (!moved) return;
    // Atualiza última posição
    lastPositionRef.current = { x: gridX, y: gridY };

    // Só funciona no modo explore (evita trigger em batalha)
    if (player.mode !== "explore") return;

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
      (tile) => tile.x === gridX && tile.y === gridY
    );

    if (isBlockedTile) return;

    function saveLibraryPosition() {
      localStorage.setItem(
        "library_return_position",
        JSON.stringify({
          x: player.gridX,
          y: player.gridY,
          direction: player.direction,
        })
      );
    }

    const encounterChance = Math.random();

    // 5% de chance
    if (encounterChance < 0.10) {
      saveLibraryPosition();

      const battleRoll = Math.random();

      if (battleRoll < 0.95) {
        navigate("/battle/hungry");
      } else {
        navigate("/battle/vandinhafragment");
      }
    }
  
  }, [player.gridX, player.gridY]);

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        className={`Master Library ${scene.className ?? ""}`}
        interactions={interactions}
        popup={popup}
        setPopup={setPopup}
      />

      {/* ✅ popup continua fora do SceneBase */}
      {popup && (
        <Talking
          name="Sistema"
          message={popup}
        />
      )}
    </>
  );
}