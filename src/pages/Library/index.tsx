import { ExploreScene } from "@/components/Game/Scenes/Default";
import { library } from "@/maps/library";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { createLibrary } from "@/interactions/library";
import { useInventory } from "@/contexts/InventoryContext";
import Talking from "@/components/Talking"
import { getTileInFront } from "@/utils/getTileInFront";
import { useGameControls } from "@/contexts/GameControlsContext";

export default function Library() {
  const { player, setPosition } = usePlayer();
  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem } = useInventory();
  const navigate = useNavigate();
  const [gotKey, setGotKey] = useState(false);
  const handlerRef = useRef<() => void>(() => {});
  const { pushControls, popControls } = useGameControls();

  handlerRef.current = () => {
    if (popup) {
      setPopup(null);
      return;
    }

    const { x, y } = getTileInFront(player, library);
    const interaction = interactionsByPosition[`${x},${y}`];

    if (interaction) {
      interaction();
    }
  };

  useEffect(() => {
    pushControls({
      onConfirm: () => handlerRef.current(),
    });

    return () => popControls();
  }, []);

  // 🧠 Interações por posição
  const interactionsByPosition = useMemo(() =>
    createLibrary({
      hasItem,
      addItem,
      setPopup: (msg) => setPopup(msg),
      gotKey,
      setGotKey,
    }),
  [
    hasItem,
    addItem,
    gotKey,
  ]);
  

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
        navigate("/library/battle/one");
      } else {
        navigate("/library/battle/two");
      }
    }

  }, [player.gridX, player.gridY]);

  return (
    <div className={`Master Library`}>
      <ExploreScene
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
      {popup && (
        <Talking
          name="Sistema"
          message={popup}
        />
      )}
    </div>
  );
}